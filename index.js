'use strict';

const EventEmitter = require('events').EventEmitter,
      Skyweb = require('skyweb/dist/skyweb.js'),
      util = require('util');

const SkypeEvent = function() {
   EventEmitter.call(this);
   this.skype = new Skyweb();
   global.se = this;
};

util.inherits(SkypeEvent, EventEmitter);
SkypeEvent.prototype.registerChatListener = function() {
   this.skype.messagesCallback = function(messages) {
      messages.forEach((message) => {
         if(message.resource.messagetype !== 'Control/Typing' && message.resource.messagetype !== 'Control/ClearTyping') {
            let conversationLink = message.resource.conversationLink;
            let msgObj = {
               getGroup: function() {
                  return {
                     getLongId: function() {
                        return conversationLink.substring(conversationLink.lastIndexOf('/') + 1);
                     },
                     getId: function() {
                        return message.resource.id;
                     },
                     getTopic: function() {
                        return message.resource.threadtopic;
                     }
                  };
               },
               getSender: function() {
                  return message.resource.from.split('/').slice(-1)[0].replace('8:', '');
               },
               getMessageRaw: function() {
                  return message.resource;
               },
               getMessage: function() {
                  return {
                     getMessage: function() {
                        return message.resource.content;
                     },
                     isEdited: function() {
                        if('skypeeditedid' in message.resource) {
                           return true;
                        }
                        return false;
                     }
                  };
               },
               reply: function(message) {
                  se.skype.sendMessage(conversationLink.substring(conversationLink.lastIndexOf('/') + 1), message);
               }
            };
            this.emit('message', msgObj);
         }
      });
   }.bind(this);
};
SkypeEvent.prototype.login = function(username, password) {
   this.skype.login(username, password).then((skype) => {
      this.emit('connection', skype);
   });
   this.registerChatListener();
};

module.exports = SkypeEvent;
