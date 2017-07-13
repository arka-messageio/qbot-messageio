/**
 * This is the entry point of the application.
 * It requires all other modules and ties together everything.
 */

var express = require("express");
var lunr = require("lunr");

var api = require("./api");
var scrape = require("./scrape");
var smalltalk = require("./smalltalk");
var qaGenerator = require("./qa-generator");

// Set up and start the chatbot.
var twilioChatbot = require("./twilio-chatbot.js")({
  fuzzyMatch: 1,
  qa : qaGenerator({}),
  smalltalk: qaGenerator(smalltalk)
});

// Get the Express webserver exported by the chatbot.
var app = twilioChatbot.webserver;

app.set("views", "./views");
app.use(express.static("public"));

var api = api({
  app: app,
  qa: qaGenerator({}),
  updateQa: twilioChatbot.updateQa
});
twilioChatbot.unansweredCallback = api.unansweredCallback;

app.get("/questions", function(request, response) {
  response.render("questions/index.ejs");
});

// Finally, add a route to the home page (which is not related to the actual in-built bug-tracker)
app.get("/", function (request, response) {
  response.render("index.ejs");
});

if (process.env.PUBLIC_DEMO === "true") {
  // Clear questions & answers every hour.
  setInterval(function() {
    twilioChatbot.updateQa(qaGenerator({}));
  }, 1000 * 60 * 60);
}