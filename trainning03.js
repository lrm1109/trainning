const express = require('express')
const redis = require('redis')

const app = express()
let R
const cacheKey = 'randomKey'
const client = redis.createClient()
client.on('error', (error) => {
	console.log(error)
})

app.get('/start', (req, res) => {
	R = Number(Math.random() * 100).toFixed(0)
	// client.hmset(cacheKey, R, (err) => {
	// 	console.log(err)
	// })
	client.set(cacheKey, R, (error, response) => {
		if (error) {
			console.log(error)
		} else {
			console.log(response)
		}
	})
	console.log(R)
	res.send('OK!')
})
function comparison(req, res) {
	const number = Number(req.params.number)
	// client.hgetall(cacheKey, (err, object) => {
	// 	R = object
	// })
	client.get(cacheKey, (error, response) => {
		if (error) {
			console.log(error)
		} else {
			R = response
		}
	})
	console.log(`R${R}`)
	if (number > R) {
		res.send('bigger')
	} else if (number < R) {
		res.send('smaller')
	} else {
		res.send('equal')
	}
}
app.get('/:number', (req, res) => {
	comparison(req, res)
}).listen(8081)
