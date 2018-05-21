var http = require('http');
var url = require('url');

http.createServer(function(request, response){
	response.writeHead(200, {'Content-Type':'text/plain'});
	var random = new Number(Math.random() * 100).toFixed(0);
	response.write(random);
	response.end();
}).listen(8081);

console.log("Random Number Generator Running...");