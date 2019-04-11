const request = require('request-promise')
const debug = require('debug')('botkit:rasa')

module.exports = config => {
  if (!config) {
    config = {}
  }

  if (!config.rasa_uri) {
    config.rasa_uri = 'http://localhost:5000'
  }

  var middleware = {
    receive: (bot, message, next) => {
      // is_echo: can be true for facebook bots when the echo webhook is subscribed
      // bot_id: keep an eye https://github.com/howdyai/botkit/pull/694
      // if bot_id is present, the message comes from another bot
      if (!message.text || message.is_echo || message.bot_id) {
        next()
        return
      }

      debug('Sending message to Rasa', message.text)
      const options = {
        method: 'POST',
        uri: `${config.rasa_uri}/parse`,
        body: {
          q: message.text,
          project: `${config.rasa_project}`
          model: `${config.rasa_model}`
        },
        json: true
      }

      request(options)
        .then(response => {
          debug('Rasa response', response)
          message.intent = response.intent
          message.entities = response.entities
          next()
        })
    },

    hears: (patterns, message) => {
      return patterns.some(pattern => {
        if (message.intent.name === pattern) {
          debug('Rasa intent matched hear pattern', message.intent, pattern)
          return true
        }
      })
    }

  }
  return middleware
}
