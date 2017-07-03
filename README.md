# Botkit / Rasa NLU plugin

This plugin provides Botkit developers a way to use the [Rasa NLU](https://rasa.ai/) open source, self hosted natural language API.

## Setup in your project

Install the plugin using the npm package

`npm i --save botkit-rasa`

Make your bot aware of the plugin:
```
var rasa = require('botkit-rasa')({rasa_uri: 'http://localhost:5000'});
controller.middleware.receive.use(rasa.receive);

controller.hears(['my_intent'],'message_received', rasa.hears, function(bot, message) {

    console.log('Intent:', message.intent);
    console.log('Entities:', message.entities);    

});
```

## Example Slack bot
In the `example` directory there's a fully functional Slack bot and facebook bot sample.

This bot demonstrates some core features of Botkit
leveraging Rasa NLU plugin:
* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* similar features for facebook bot.
### Prerequisites
* Install [Node.js](https://nodejs.org/)

### Run the example bot
Get Rasa NLU up and running by checking out [their repository](https://github.com/RasaHQ/rasa_nlu) and following the [instructions to setup](https://github.com/RasaHQ/rasa_nlu#setup) a Rasa NLU instance.
At this point you should have a Rasa NLU instance up and running.

Now get a Bot token from Slack (you will need this later when launching the bot from the command line):
* http://my.slack.com/services/new/bot

Clone this repository and move into the example directory:
* `git clone https://github.com/sohlex/botkit-rasa.git`

Open another terminal and from the example directory, run the commands (`TOKEN` is the one that you got before from the slack website):
* `npm install`
* `slack_token=<TOKEN> node bot.js`
For facebook_bot
* `page_token=<MY PAGE TOKEN> verify_token=<MY_VERIFY_TOKEN> node facebook_bot.js [--lt [--ltsubdomain CUSTOM_SUBDOMAIN]]`
### Use the bot
Find your bot inside Slack to send it a direct message.

Say: "Hello"

The bot should reply "Hello!" If it didn't, there's a problem with
Rasa NLU configuration, check the bot and Rasa console for errors.

Make sure to invite your bot into other channels using /invite @<my bot>!

### Extend the bot

If this middleware doesn't satisfy your needs, you can use it as inspiration for your implementations or contribute to this project!
Furthermore, Botkit has many features for building cool and useful bots!

Read all about it [here](http://howdy.ai/botkit).

## What this middleware does
Using this Rasa NLU middleware plugin for Botkit causes every message that is sent to your bot to be first sent to Rasa NLU for processing. The results of the call to Rasa NLU are added into the incoming message as `message.intents` and `message.entities`.

Using the Rasa NLU `hears` middleware tells Botkit to look for Rasa NLU intents information, and match them using this information instead of the built in pattern matching function.

You must create an intent in the understandings area of Rasa NLU and train it to register certain expressions.

More informations are available in the [Rasa NLU documentation](https://rasa-nlu.readthedocs.io/en/latest/)
