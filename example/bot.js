/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/

This is a sample Slack bot built with Botkit.

This bot demonstrates some core features of Botkit
leveraging Rasa NLU plugin:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages

# RUN THE BOT:

  Get Rasa NLU up and running by checking out their repository

    -> https://github.com/RasaHQ/rasa_nlu

  Follow the instructions on the README.md file and start Rasa NLU

  Then get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Clone the botkit-rasa repository and move into the example directory:

    -> git clone https://github.com/sohlex/botkit-rasa.git

  Open the terminal and from the example directory, run the commands:

    -> npm install
    -> slack_token= <token> node bot.js

# USE THE BOT:

  Find your bot inside Slack to send it a direct message.

  Say: "Hello"

  The bot should reply "Hello!" If it didn't, there's a problem with
  Rasa NLU configuration, check the bot and Rasa console for errors.

  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:

  Botkit is has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

if (!process.env.slack_token) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

const Botkit = require('botkit')
const rasa = require('../src/middleware-rasa')({
  rasa_uri: 'http://localhost:5000',
  rasa_project: undefined,
  rasa_model: undefined
})

const controller = Botkit.slackbot({
  debug: true
})

const bot = controller.spawn({
  token: process.env.slack_token
}).startRTM()
console.log(rasa)
controller.middleware.receive.use(rasa.receive)

/* this uses rasa middleware defined above */
controller.hears(['greet'], 'direct_message,direct_mention,mention', rasa.hears, function (bot, message) {
  console.log(JSON.stringify(message))
  console.log('hello')
  bot.reply(message, 'Hello!')
})
