/*
 * For mailing users
 */

var transport = email.createTransport('SMTP', {
   service: 'Gmail',
   auth: {
      user: 'hackerspace@gmail.com', // <- Hackerspace email
      pass: 'password' // <- password
   }
});

var sendAll = function(finPoll, emails) {
   console.log('Setting up message');
   var msg = 'A votação da poll "' + finPoll.title + '" foi finalizada.<br/><br/>Votação criada por: ' +
      finPoll.author + '<br/>';
   var mailOptions = {
      from: 'Hacker Concil <hackerspace@gmail.com>',
      to: emails,
      subject: 'Poll Finilized',
      html: msg
   }
   console.log('Sending...');

   send(mailOptions);
   console.log('Finished sending');
}

exports.sendToUsers = function(finPoll) {
   userDAO.list(function(users) {
      var sendTo = '';
      for (var i = 0; i < users.length; i++) {
         var sendTo = sendTo + users[i].email;
         if (i != users.length - 1) sendTo = sendTo + ',';
      }

      if (sendTo == '') console.log('Não há nenhum usuário cadastrado!');
      else sendAll(finPoll, sendTo);
   });
}

var send = function(mailOptions) {
   transport.sendMail(mailOptions, function(error, response) {
      if (error)
         console.log(error);
      else
         console.log('Message sent: ' + response.message);
      transport.close();
   });
}
