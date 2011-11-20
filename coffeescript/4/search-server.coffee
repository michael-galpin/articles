http = require "http"
			
fetchPage = (host, port, path, callback) ->
	options = 
		host: host
		port: port
		path: path
	req = http.get options, (res) ->
		contents = ""
		res.on 'data', (chunk) ->
			contents += "#{chunk}"
		res.on 'end', () ->
			callback(contents)
	req.on "error", (e) ->
		console.log "Erorr: {e.message}"

googleSearch = (keyword, callback) ->
	host = "ajax.googleapis.com"
	path = "/ajax/services/search/web?v=1.0&q=#{encodeURI(keyword)}"
	fetchPage host, 80, path, callback

twitterSearch = (keyword, callback) ->
	host = "search.twitter.com"
	path = "/search.json?q=#{encodeURI(keyword)}"
	fetchPage host, 80, path, callback

combinedSearch = (keyword, callback) ->
	data = 
		google : ""
		twitter : ""
	googleSearch keyword, (contents) ->
		contents = JSON.parse contents
		data.google = contents.responseData.results
		if data.twitter != ""
			callback(data)
	twitterSearch keyword, (contents) ->
		contents = JSON.parse contents
		data.twitter = contents.results
		if data.google != ""
			callback(data)

path = require "path"
fs = require "fs"
serveStatic = (uri, response) ->
	fileName = path.join process.cwd(), uri
	path.exists fileName, (exists) ->
		if not exists
			response.writeHead 404, 'Content-Type': 'text/plain'
			response.end "404 Not Found #{uri}!\n"
			return
		fs.readFile fileName, "binary", (err,file) ->
			if err
				response.writeHead 500, 'Content-Type': 'text/plain'
				response.end "Error #{uri}: #{err} \n"
				return
			response.writeHead 200
			response.write file, "binary"
			response.end()

doSearch = (uri, response) ->
	query = uri.query.split "&"
	params = {}
	query.forEach (nv) ->
		nvp = nv.split "="
		params[nvp[0]] = nvp[1]
	keyword = params["q"]
	combinedSearch keyword, (results) ->
		response.writeHead 200, 'Content-Type': 'text/plain'
		response.end JSON.stringify results
			
url = require "url"
server = http.createServer (request, response) ->
	uri = url.parse(request.url)
	if uri.pathname is "/doSearch"
		doSearch uri, response
	else
		serveStatic uri.pathname, response	
server.listen 8080
console.log "Server running at http://127.0.0.1:8080"