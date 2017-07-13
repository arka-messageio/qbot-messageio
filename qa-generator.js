var lunr = require("lunr");

module.exports = function(qa) {
  var module = {};
  
  module.qa = qa;
  
  module.searchIndex = lunr(function() {
    this.field("question");
    
    for (var question in qa) {
      this.add({
        id: question,
        question: question
      })
    }
  });
  
  return module;
}