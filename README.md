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

## What it does
Using this Rasa NLU middleware plugin for Botkit causes every message that is sent to your bot to be first sent to Rasa NLU for processing. The results of the call to Rasa NLU are added into the incoming message as `message.intents` and `message.entities`, and will match the results of this Rasa NLU API call.

Using the Rasa NLU hears middleware tells Botkit to look for Rasa NLU intents information, and match them using this information instead of the built in pattern matching function.

You must create an intent in the understandings area of Rasa NLU and train it to register certain expressions.

I.e "intent" -> "weather"

Expression: "What is the weather?" and that maps to the weather intent.

Unless you want to directly access the information returned by wit, you can use this transparently by enabling bot the receive and hears middlewares.
