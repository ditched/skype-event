const SkypeEvent = require('../index'),
      skype = new SkypeEvent();

skype.on('connection', function(bot) {
   console.log(bot);
});

skype.on('message', function(e) {
   if(e.getSender() === 'sys.bot') return;
   console.log(e.getMessageRaw());
   if(e.getSender() === 'master_zombiecow') {
      if(e.getMessage().isEdited()) {
         e.reply('message was edited!');
      }
      if(e.getMessage().getMessage() == '.version') {
         e.reply('NodeJS Version: ' + process.version);
      }
   }
});

skype.login('username', 'password');
