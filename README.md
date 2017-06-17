# Botkit / Rasa NLU plugin

This plugin provides Botkit developers a way to use the [Rasa NLU](https://rasa.ai/) open source, self hosted natural language API.

## Setup
```
var rasa = require('botkit-rasa')({rasa_uri: 'http://localhost:5000'});
controller.middleware.receive.use(rasa.receive);

controller.hears(['my_intent'],'message_received', rasa.hears, function(bot, message) {

    console.log('Intent:', message.intent);
    console.log('Entities:', message.entities);    

});
```

To run the example:
* Clone this repository
* Move into the new directory and run the command `npm run rasa:start` (ignore the errors you see on the console in the first run, everything is ok :)

## What it does
Using this Rasa NLU middleware plugin for Botkit causes every message that is sent to your bot to be first sent to Rasa NLU for processing. The results of the call to Rasa NLU are added into the incoming message as `message.intents`, `message.entities` and `message.confidence`.

Using the Rasa NLU `hears` middleware tells Botkit to look for Rasa NLU intents information, and match them using this information instead of the built in pattern matching function.

You must create an intent in the understandings area of Rasa NLU and train it to register certain expressions.

I.e "intent" -> "greet"

Expression: "Hello!" and that maps to the `greet` intent.
