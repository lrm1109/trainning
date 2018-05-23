const express = require('express')
const redis = require('redis')

const app = express()
let R
const cacheKey = 'randomKey'
const client = redis.createClient()
client.on('error', (error) => {
	console.log(error)
})

app.set('view engine', 'ejs')

app.get('/start', (req, res) => {
	R = Number(Math.random() * 100).toFixed(0)
	client.set(cacheKey, R, (error, response) => {
		if (error) {
			console.log(error)
		} else {
			console.log(response)
		}
	})
	console.log(R)
	res.render('index')
	// res.sendFile(`${__dirname}/index.html`)
})
function comparison(req, res) {
	const number = Number(req.params.number)
	client.get(cacheKey, (error, response) => {
		if (error) {
			console.log(error)
		} else {
			R = response
		}
		let result
		if (number > R) {
			result = 'bigger'
		} else if (number < R) {
			result = 'smaller'
		} else {
			result = 'equal'
		}
		// res.send(result)
		res.json(result)
	})
}
app.post('/:number', (req, res) => {
	comparison(req, res)
}).listen(8081)
