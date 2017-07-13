# ❓🤖 QuestionBot
*(from [Message.io](https://message.io/home))*

Frustrated because nobody reads your thoughtfully crafted FAQ pages? Overwhelmed with questions that have already been answered? Just connect your FAQ page for anything to QuestionBot and have her answer questions for you.

![Screenshot](https://cdn.glitch.com/9c5faf5d-74c7-4129-898a-8c9f743f6d81%2Fscreenshot.png?1499971533527)

## Usage
Head over to the [Questions console](https://qbot-messageio.glitch.me/questions) and start typing in questions and answers under the **Questions** heading.

QuestionBot makes it extremely easy to import questions and answers from an existing FAQ page: just paste the URL into the "Automatically scrape questions from an existing FAQ page:" field and QuestionBot will automatically add any questions and their respective answers into the question and answer section below.
* <sup>QuestionBot's FAQ page import is very accurate most of the time, but still make sure to proofread the questions and answers it imported to make sure that it didn't import anything it wasn't supposed to.</sup>

Once you are satisfied with the questions and answers you see on the [console](https://qbot-messageio.glitch.me/questions), make sure to scroll down and click "Save Changes".

Sometimes, a user may ask QuestionBot a question that she can't find and answer for. These unanswered questions will show up *in real-time* under the **Unanswered Questions** heading in the [Questions console](https://qbot-messageio.glitch.me/questions).

If you want to test out the chatbot, you'll have to [remix this Glitch project](https://glitch.com/edit/#!/remix/qbot-messageio) and set it up for yourself by following the "**Set it up for yourself**" instructions below. You will then be able to test out QuestionBot by texting the number you configured in the setup section.

## Set it up for yourself
1. Remix this project on Glitch by clicking here: 
  [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/qbot-messageio)
1. Set up an account on [Twilio](https://www.twilio.com/).
   1. Add a number to your account's [Phone Numbers](https://www.twilio.com/console/phone-numbers/incoming). This will be the number your bot can be reached at (over SMS).
   1. Click on the number to configure it.
   1. Scroll down to the "Messaging" section.
      1. Set "Configure with" to "Webhooks, or TwiML Bins or Functions"
      1. Set "A message comes in" to "Webhook", set the URL to be `<URL OF YOUR REMIXED GLITCH PROJECT>/twilio/sms` and set the method to "HTTP POST"
   1. *(Note: If you have a trial Twilio account, only you and people you have added to your [Verified Caller IDs](https://www.twilio.com/console/phone-numbers/verified) will be able to talk to your bot).*
1. Set up your `.env` file.
   1. You should probably set `PUBLIC_DEMO` to `false`, unless you want your questions and answers to be cleared every 1 hour (which is what currently happens in this public demo).
1. You're all set! Go ahead and start texting to your newly created bot watch the magic.
### Note about security
QuestionBot is a demo bot, so no security is added by default. You will likely want to add some form of authentication to your remix so that only an authorized administrator can access the Questions console located at `<URL OF YOUR REMIXED GLITCH PROJECT>/questions`.

## The code
Feel free to look through the code and the comments and adapt it to your own needs or build your own bot with it. The inline comments in `ciscospark-chatbot.js` are quite descriptive and can help you understand how the chatbot works and how to adapt it.
* `api.js`
  
  Contains the internal RESTful API that is used to update the server from the user's [Questions console](https://qbot-messageio.glitch.me/questions).
* `qa-generator.js`

  Helper module that wraps [Lunr](https://lunrjs.com/) in a way that is reused throughout the project.
* `scrape.js`

  Scraper that is used to parse questions and answers from FAQ pages. Read the comments in the file to learn more about how the question and answer detection algorithm works.
* `server.js`
  
  This is the entry point of the application.
  It requires all other modules and ties together everything.
* `smalltalk.json`

  A map of possible answers to common questions said by users as smalltalk. Responding to smalltalk from users makes the bot feel much more human. Feel free to expand this map with more questions and responses as needed.
  
  (The smalltalk map is only queried if the bot could not find a match in one of the already-set questions and answers).
* `twilio-chatbot.js`
  
  Actual chatbot that responds to events sent by Twilio to the registered webhook.
* `public`
  
  CSS for styling the Bootstrap web view for the bug tracker.
* `views`
  
  Templated HTML pages for the homepage and web views of BugBot. Intended for use with the [EJS template engine](http://www.embeddedjs.com/).

## Tech stack
The following is a list of great tools we used to rapidly develop this chatbot in under a week:
 * [Bootstrap](http://getbootstrap.com/)
 * [jQuery](https://jquery.com/)
 * [Glitch](https://glitch.com/)
 * [Twilio](https://www.twilio.com/)
