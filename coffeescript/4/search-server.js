(function() {
  var async, fetchPage, http;
  async = require("async");
  http = require("http");
  console.log("async = " + (typeof async));
  fetchPage = function(path, host, callback) {
    var client, options;
    options = {
      host: host,
      port: 80,
      path: path,
      method: "GET"
    };
    client = http.request(options, function(results) {
      var content;
      content = "";
      results.on("data", function(line) {
        return content += line;
      });
      return results.on("end", function() {
        return callback("", content);
      });
    });
    return client.end;
  };
  fetchPage("search.twitter.com", "/search.json?q=blue%20angels", function(str, content) {
    return console.log(content);
  });
}).call(this);
