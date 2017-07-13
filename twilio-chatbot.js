var express = require("express");
var twilio = require("twilio");
var bodyParser = require("body-parser");

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = function(options) {
  var module = {};
  
  module.updateQa = function(newQa) {
    options.qa = newQa;
  }
  
  var app = express();
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.post("/twilio/sms", function(request, response) {
    var twiml = new twilio.twiml.MessagingResponse();

    console.log("User texted: " + request.body.Body);
    
    // Remove stuff that confuses the search engine, like punctuation.
    var body = request.body.Body.replace(/[^ \w]/g, "");
    // Make every word have fuzzy matching with 1 letter.
    body = body.replace(/(\S+)(\s|$)/g, "$1~" + options.fuzzyMatch + " ");
    
    var answer = "";
    
    var matches = options.qa.searchIndex.search(body);
    if (matches.length < 1) {
      function fallback() {
        if (module.unansweredCallback !== undefined) {
          module.unansweredCallback(request.body.Body);
        }
        answer = "I'm sorry, I couldn't find a good answer for your question.";
      }
      if (!options.smalltalk) {
        fallback();
      } else {
        var smalltalkMatches = options.smalltalk.searchIndex.search(body);
        if (smalltalkMatches.length < 1) {
          fallback();
        } else {
          // Pick a random response for the best match smalltalk.
          answer = pickRandom(options.smalltalk.qa[smalltalkMatches[0].ref]);
        }
      }
    } else {
      // Get the answer to the best match question.
      answer = options.qa.qa[matches[0].ref];
    }
    
    console.log("Reply:       " + answer);
    twiml.message(answer);
    
    response.writeHead(200, {
      "Content-Type": "text/html"
    });
    
    response.end(twiml.toString());
  });

  app.listen(process.env.PORT);

  module.webserver = app;
  
  return module;
}


