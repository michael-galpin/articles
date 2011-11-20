(function() {
  var CombinedSearch, GoogleSearchResult, MockSearch, SearchResult, TwitterSearchResult, mockGoogleData, mockTwitterData;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  SearchResult = (function() {
    function SearchResult(data) {
      this.title = data.title;
      this.link = data.link;
      this.extras = data;
    }
    SearchResult.prototype.toHtml = function() {
      return "<a href='" + this.link + "'>" + this.title + "</a>";
    };
    SearchResult.prototype.toJson = function() {
      return JSON.stringify(this.extras);
    };
    return SearchResult;
  })();
  GoogleSearchResult = (function() {
    __extends(GoogleSearchResult, SearchResult);
    function GoogleSearchResult(data) {
      GoogleSearchResult.__super__.constructor.call(this, data);
      this.content = this.extras.content;
    }
    GoogleSearchResult.prototype.toHtml = function() {
      return "" + GoogleSearchResult.__super__.toHtml.apply(this, arguments) + " <div class='snippet'>" + this.content + "</div>";
    };
    return GoogleSearchResult;
  })();
  TwitterSearchResult = (function() {
    __extends(TwitterSearchResult, SearchResult);
    function TwitterSearchResult(data) {
      TwitterSearchResult.__super__.constructor.call(this, data);
      this.source = this.extras.from_user;
      this.link = "http://twitter.com/" + this.source + "/status/" + this.extras.id_str;
      this.title = this.extras.text;
    }
    TwitterSearchResult.prototype.toHtml = function() {
      return "<a href='http://twitter.com/" + this.source + "'>@" + this.source + "</a>: " + TwitterSearchResult.__super__.toHtml.apply(this, arguments);
    };
    return TwitterSearchResult;
  })();
  MockSearch = (function() {
    function MockSearch() {}
    MockSearch.prototype.search = function(query, callback) {
      var obj, results;
      results = {
        google: (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = mockGoogleData.length; _i < _len; _i++) {
            obj = mockGoogleData[_i];
            _results.push(new GoogleSearchResult(obj));
          }
          return _results;
        })(),
        twitter: (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = mockTwitterData.length; _i < _len; _i++) {
            obj = mockTwitterData[_i];
            _results.push(new TwitterSearchResult(obj));
          }
          return _results;
        })()
      };
      return callback(results);
    };
    return MockSearch;
  })();
  CombinedSearch = (function() {
    function CombinedSearch() {}
    CombinedSearch.prototype.search = function(keyword, callback) {
      var xhr;
      xhr = new XMLHttpRequest;
      xhr.open("GET", "/doSearch?q=" + (encodeURI(keyword)), true);
      xhr.onreadystatechange = function() {
        var response, results;
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            response = JSON.parse(xhr.responseText);
            results = {
              google: response.google.map(function(result) {
                return new GoogleSearchResult(result);
              }),
              twitter: response.twitter.map(function(result) {
                return new TwitterSearchResult(result);
              })
            };
            return callback(results);
          }
        }
      };
      return xhr.send(null);
    };
    return CombinedSearch;
  })();
  this.doSearch = function() {
    var $, appender, kw, ms;
    $ = function(id) {
      return document.getElementById(id);
    };
    kw = $("searchQuery").value;
    appender = function(id, data) {
      return data.forEach(function(x) {
        return $(id).innerHTML += "<p>" + (x.toHtml()) + "</p>";
      });
    };
    ms = new CombinedSearch;
    return ms.search(kw, function(results) {
      appender("gr", results.google);
      return appender("tr", results.twitter);
    });
  };
  mockGoogleData = [
    {
      GsearchResultClass: "GwebSearch",
      link: "http://jashkenas.github.com/coffee-script/",
      url: "http://jashkenas.github.com/coffee-script/",
      visibleUrl: "jashkenas.github.com",
      cacheUrl: "http://www.google.com/search?q\u003dcache:nuWrlCK4-v4J:jashkenas.github.com",
      title: "\u003cb\u003eCoffeeScript\u003c/b\u003e",
      titleNoFormatting: "CoffeeScript",
      content: "\u003cb\u003eCoffeeScript\u003c/b\u003e is a little language that compiles into JavaScript. Underneath all of   those embarrassing braces and semicolons, JavaScript has always had a \u003cb\u003e...\u003c/b\u003e"
    }, {
      GsearchResultClass: "GwebSearch",
      link: "http://en.wikipedia.org/wiki/CoffeeScript",
      url: "http://en.wikipedia.org/wiki/CoffeeScript",
      visibleUrl: "en.wikipedia.org",
      cacheUrl: "http://www.google.com/search?q\u003dcache:wshlXQEIrhIJ:en.wikipedia.org",
      title: "\u003cb\u003eCoffeeScript\u003c/b\u003e - Wikipedia, the free encyclopedia",
      titleNoFormatting: "CoffeeScript - Wikipedia, the free encyclopedia",
      content: "\u003cb\u003eCoffeeScript\u003c/b\u003e is a programming language that transcompiles to JavaScript. The   language adds syntactic sugar inspired by Ruby, Python and Haskell to enhance \u003cb\u003e...\u003c/b\u003e"
    }, {
      GsearchResultClass: "GwebSearch",
      link: "http://codelikebozo.com/why-im-switching-to-coffeescript",
      url: "http://codelikebozo.com/why-im-switching-to-coffeescript",
      visibleUrl: "codelikebozo.com",
      cacheUrl: "http://www.google.com/search?q\u003dcache:VDKirttkw30J:codelikebozo.com",
      title: "Why I\u0026#39;m (Finally) Switching to \u003cb\u003eCoffeeScript\u003c/b\u003e - Code Like Bozo",
      titleNoFormatting: "Why I\u0026#39;m (Finally) Switching to CoffeeScript - Code Like Bozo",
      content: "Sep 5, 2011 \u003cb\u003e...\u003c/b\u003e You may have already heard about \u003cb\u003eCoffeeScript\u003c/b\u003e and some of the hype   surrounding it but you still have found several reasons to not make the \u003cb\u003e...\u003c/b\u003e"
    }
  ];
  mockTwitterData = [
    {
      created_at: "Wed, 09 Nov 2011 04:18:49 +0000",
      from_user: "jashkenas",
      from_user_id: 123323498,
      from_user_id_str: "123323498",
      geo: null,
      id: 134122748057370625,
      id_str: "134122748057370625",
      iso_language_code: "en",
      metadata: {
        recent_retweets: 4,
        result_type: "popular"
      },
      profile_image_url: "http://a3.twimg.com/profile_images/1185870726/gravatar_normal.jpg",
      source: "&lt;a href=&quot;http://itunes.apple.com/us/app/twitter/id409789998?mt=12&quot; rel=&quot;nofollow&quot;&gt;Twitter for Mac&lt;/a&gt;",
      text: "&quot;CoffeeScript [is] the closest I felt to the power I had twenty years ago in Smalltalk&quot; - Ward Cunningham (http://t.co/2Wve2V4l) Nice.",
      to_user_id: null,
      to_user_id_str: null
    }
  ];
}).call(this);
