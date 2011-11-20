http = require "http"
url = require "url"
path = require "path"
fs = require "fs"
			
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
	fetchPage "ajax.googleapis.com", 80, "/ajax/services/search/web?v=1.0&q=#{encodeURI(keyword)}", callback

twitterSearch = (keyword, callback) ->
	fetchPage "search.twitter.com", 80, "/search.json?q=#{encodeURI(keyword)}", callback

combinedSearch = (keyword, callback) ->
	data = 
		google : ""
		twitter : ""
	googleSearch keyword, (contents) ->
		contents = JSON.parse(contents)
		data.google = contents.responseData.results
		if data.twitter != ""
			callback(data)
	twitterSearch keyword, (contents) ->
		contents = JSON.parse(contents)
		data.twitter = contents.results
		if data.google != ""
			callback(data)

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
			
server = http.createServer (request, response) ->
	uri = url.parse(request.url)
	if uri.pathname == "/doSearch"
		query = uri.query.split "&"
		params = {}
		query.forEach (nv) ->
			console.log "parsing query string nv= #{nv}"
			nvp = nv.split "="
			params[nvp[0]] = nvp[1]
		keyword = params["q"]
		combinedSearch keyword, (results) ->
			response.writeHead 200, 'Content-Type': 'text/plain'
			response.end JSON.stringify(results)
	else
		serveStatic uri.pathname, response	
server.listen 8080
console.log "Server running at http://127.0.0.1:8080"