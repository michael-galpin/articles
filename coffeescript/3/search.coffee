class SearchResult
	constructor: (data) ->
		@title = data.title
		@link = data.link
		@extras = data
	
	toHtml: () -> "<a href='#{@link}'>#{@title}</a>"
	toJson: () -> JSON.stringify @extras

class GoogleSearchResult
	toHtml: () ->
		"#{super.toHtml()} <div class='snippet'>#{@extras.snippet}</div>"
			
class TwitterSearchResult
	toHtml: () ->
		"<a href='http://twitter.com/#{@extras.from_user}'>@#{@extras.from_user}</a>: #{super.toHtml()}"
		
class MockSearch
	search: (query, callback) ->
		results = 
			google: (new GoogleSearchResult obj for obj in mockGoogleData)
			twitter: (new TwitterSearchResult obj for obj in mockTwitterData)
		callback(results)


