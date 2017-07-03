if (!process.env.page_token) {
    console.log('Error: Specify page_token in environment');
    process.exit(1);
}

if (!process.env.verify_token) {
    console.log('Error: Specify verify_token in environment');
    process.exit(1);
}

if (!process.env.app_secret) {
    console.log('Error: Specify app_secret in environment');
    process.exit(1);
}

var Botkit = require('botkit')
var rasa = require('../src/middleware-rasa')({
  rasa_uri: 'http://localhost:5000',
  rasa_model: undefined
})
var commandLineArgs = require('command-line-args');
var localtunnel = require('localtunnel');

const ops = commandLineArgs([
      {name: 'lt', alias: 'l', args: 1, description: 'Use localtunnel.me to make your bot available on the web.',
      type: Boolean, defaultValue: false},
      {name: 'ltsubdomain', alias: 's', args: 1,
      description: 'Custom subdomain for the localtunnel.me URL. This option can only be used together with --lt.',
      type: String, defaultValue: null},
   ]);

if(ops.lt === false && ops.ltsubdomain !== null) {
    console.log("error: --ltsubdomain can only be used together with --lt.");
    process.exit();
}
var controller = Botkit.facebookbot({
    debug: true,
    log: true,
    access_token: process.env.page_token,
    verify_token: process.env.verify_token,
    app_secret: process.env.app_secret,
    validate_requests: true, // Refuse any requests that don't come from FB on your receive webhook, must provide FB_APP_SECRET in environment variables
});

var bot = controller.spawn({
});
console.log(rasa);
controller.middleware.receive.use(rasa.receive);

controller.setupWebserver(process.env.port || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
        if(ops.lt) {
            var tunnel = localtunnel(process.env.port || 3000, {subdomain: ops.ltsubdomain}, function(err, tunnel) {
                if (err) {
                    console.log(err);
                    process.exit();
                }
                console.log("Your bot is available on the web at the following URL: " + tunnel.url + '/facebook/receive');
            });

            tunnel.on('close', function() {
                console.log("Your bot is no longer available on the web at the localtunnnel.me URL.");
                process.exit();
            });
        }
    });
});


/*controller.hears(['book-hotel'], 'direct_message,direct_mention,mention', rasa.hears, function (bot, message) {
  console.log(JSON.stringify(message))
  console.log('this is an hotel booking intent')
  bot.reply(message, 'This is an hotel booking intent')
})
controller.hears(['weather'], 'direct_message,direct_mention,mention', rasa.hears, function (bot, message) {
  console.log(JSON.stringify(message))
  console.log('this is an weather intent')
  bot.reply(message, 'This is an weather intent')
})
controller.hears(['affirm'], 'direct_message,direct_mention,mention', rasa.hears, function (bot, message) {
  console.log(JSON.stringify(message))
  console.log('this is an affirm intent')
  bot.reply(message, 'This is an affirm intent')
})
controller.hears(['goodbye'], 'direct_message,direct_mention,mention', rasa.hears, function (bot, message) {
  console.log(JSON.stringify(message))
  console.log('this is an bye intent')
  bot.reply(message, 'This is an bye intent')
})
controller.hears(['greet'], 'direct_message,direct_mention,mention', rasa.hears, function (bot, message) {
  console.log(JSON.stringify(message))
  console.log('hello')
  bot.reply(message, 'Hello!!!')
}) */
controller.hears(['greet'], 'message_received,facebook_postback',rasa.hears, function(bot, message) {
    bot.reply(message,'Hello!')
});
controller.hears(['intent_name'], 'message_received,facebook_postback',rasa.hears, function(bot, message) {
    bot.reply(message,'this is intent_name')
});

controller.hears(['goodbye'], 'message_received,facebook_postback',rasa.hears, function(bot, message) {
    bot.reply(message,'Bye')
});
controller.hears(['quick replies'], 'message_received',rasa.hears, function(bot, message) {

    bot.reply(message, {
        text: 'Hey! This message has some quick replies attached.',
        quick_replies: [
            {
                "content_type": "text",
                "title": "Yes",
                "payload": "yes",
            },
            {
                "content_type": "text",
                "title": "No",
                "payload": "no",
            }
        ]
    });

});
