var request = require("request");
var toMarkdown = require("to-markdown");

/**
 * This is the web page scraper that tries to get individual questions and their answers from HTML FAQ pages.
 * 
 * Any DOM node whose text ends in "?" is considered a question.
 * A question's answer is all the text that is between one question and the next.
 * However, the last question's answer is the next text node after it and nothing more. This is done to avoid gathering footer text and similar items as part of the "answer" to a question when they are not.
 */
module.exports = function(url, onSuccess, onError) {
  request(url, function(error, response, body) {
    if (error) {
      onError(error);
      return;
    }
    if (response.statusCode !== 200) {
      onError("Expected status code \"200\", got \"" + response.statusCode + "\".");
      return;
    }
    // No errors, continue.
    
    // to-markdown helps determine which elements are block elements and consolidate multi-line text into one line.
    var markdown = toMarkdown(body, {
      converters: [
        {
          filter: function(node) {
            return true;
          },
          replacement: function(innerHTML, node) {
            if (this.isBlock(node)) {
              return "\n" + innerHTML + "\n";
            }
            return innerHTML;
          }
        }
      ]
    });
    // Split into lines.
    var lines = markdown.split("\n");
    
    // Map for storing questions (keys) and answers (values).
    var qa = {};
    var question = undefined;
    var answer = undefined;
    // The tentative exp
    var tentativeExpandedAnswer = "";
    // The answer that is used when no answer could be found.
    var noAnswerText = "";
    for (var i = 0; i < lines.length; i++) {
      var text = lines[i].replace("\\.", ".");
      // If the text in the node ends with a question mark, consider it a question.
      if (text.endsWith("?")) {
        if (question !== undefined) {
          if (answer === undefined) {
            answer = noAnswerText;
          }
          // If there was a previous question, end it and commit it to the Q&A map.
          answer += tentativeExpandedAnswer;
          qa[question] = answer.trim();
        }
        question = text;
        // Waiting for an answer.
        answer = undefined;
        tentativeExpandedAnswer = "";
      } else if (question !== undefined) {
        if (answer === undefined && text.trim()) {
          // Question with no answer yet.
          answer = text;
        } else {
          tentativeExpandedAnswer += "\n" + text;
        }
      }
    }
    if (answer === undefined) {
      answer = noAnswerText;
    }
    // Don't add the tentative expanded answer here.
    qa[question] = answer.trim();
    
    // Done.
    onSuccess(qa);
  });
};
