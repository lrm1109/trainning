const express = require('express')
const redis = require('redis')
const _ = require('lodash')

const app = express()
const cacheKey = 'randomKey'
const client = redis.createClient()
client.on('error', (error) => {
	console.log(error)
})

app.set('view engine', 'ejs')

function getRandom() {
	// console.log(process.argv[2])
	const R = _.random(Number(process.argv[2]))
	client.set(cacheKey, R, (error, response) => {
		if (error) {
			console.log(error)
		} else {
			console.log(response)
		}
	})
	console.log(R)
}

app.get('/', (req, res) => {
	getRandom()
	res.render('index')
})

app.get('/start', (req, res) => {
	getRandom()
	// res.render('index')
	res.send('OK')
})
function comparison(req, res) {
	const number = Number(req.params.number)
	client.get(cacheKey, (error, response) => {
		if (error) {
			console.log(error)
		}
		let result
		if (number > response) {
			result = 'bigger'
		} else if (number < response) {
			result = 'smaller'
		} else {
			result = 'equal'
			getRandom()
		}
		// res.send(result)
		res.send(result)
	})
}
app.post('/:number', (req, res) => {
	comparison(req, res)
})

app.listen(8081)
module.exports = app
