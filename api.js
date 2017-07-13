var bodyParser = require("body-parser");
var events = require("events");

var scrape = require("./scrape");
var qaGenerator = require("./qa-generator");

module.exports = function(options) {
  var module = {};
  
  var unansweredQuestions = [];
  
  options.app.use(bodyParser.json())
  
  options.app.get("/api/questions", function(request, response) {
    response.json(options.qa.qa);
  });
  
  options.app.post("/api/questions", function(request, response) {
    scrape(request.body.url, function(qa) {
      response.json(qa);
    }, function(error) {
      response.status(500).send(error);
    });
  });
  
  options.app.put("/api/questions", function(request, response) {
    var newQa = qaGenerator(request.body);
    options.qa.qa = newQa.qa;
    options.qa.searchIndex = newQa.searchIndex;
    if (options.updateQa) {
      options.updateQa(newQa);
    }
    response.status(200).end();
  });
  
  options.app.get("/api/questions/unanswered", function(request, response) {
    response.json(unansweredQuestions);
  });
  
  options.app.delete("/api/questions/unanswered/:question", function(request, response) {
    var q = decodeURIComponent(request.params.question);
    while (true) {
      var index = unansweredQuestions.indexOf(q);
      if (index === -1) {
        break;
      }
      unansweredQuestions.splice(index, 1);
    }
    response.status(200).end();
  });
  
  // Set up long-polling
  var messageBus = new events.EventEmitter();
  messageBus.setMaxListeners(1000);
  options.app.post("/api/questions/unanswered", function(request, response) {
    messageBus.once("message", function(data) {
      response.json(data);
    });
  });
  module.unansweredCallback = function(q) {
    unansweredQuestions.push(q);
    messageBus.emit("message", q);
  }
  
  return module;
}
