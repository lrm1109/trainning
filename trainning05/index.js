const express = require('express')
const redis = require('redis')
const _ = require('lodash')

const app = express()
const cacheKey = 'randomKey'
const client = redis.createClient()
const MIX = 1000000
client.on('error', (error) => {
	console.log(error)
})

function getRandom() {
	const R = _.random(MIX)
	client.set(cacheKey, R, (error, response) => {
		if (error) {
			console.log(error)
		} else {
			console.log(response)
		}
	})
	console.log(R)
}

const randomCallback = (callback) => {
	const number = _.random(MIX)
	console.log(number)
	setTimeout(() => callback(number))
}

const comparisonCallback = (req, res, callback) => {
	randomCallback((number) => {
		client.get(cacheKey, (error, response) => {
			if (error) {
				console.log(error)
			}
			if (number === Number(response)) {
				callback(number)
				res.send(`equal, guess ${number}`)
			} else {
				comparisonCallback(req, res, (nextNumber) => {
					callback(nextNumber)
				})
			}
		})
	})
}

const comparePromise = () => new Promise((resolve, reject) => {
	const number = _.random(MIX)
	console.log(number)
	client.get(cacheKey, (error, response) => {
		if (error) {
			console.log(error)
			return reject(error)
		}
		if (number === Number(response)) {
			return resolve(number)
		}
		return setTimeout(() => {
			comparePromise().then(res => resolve(res))
		})
	})
})

const randomAsync = () => new Promise(((resolve, reject) => {
	const number = _.random(MIX)
	setTimeout(() => {
		if (number !== null) {
			console.log(number)
			resolve(number)
		} else {
			reject()
		}
	})
}))

const comparisonAsync = async (req, res) => {
	try {
		const result = await randomAsync()
		client.get(cacheKey, async (error, response) => {
			if (error) {
				console.log(error)
			}
			if (result === Number(response)) {
				console.log(`async: equal, guess ${result}`)
				res.send(`equal, guess ${result}`)
			} else {
				await comparisonAsync(req, res)
			}
		})
	} catch (err) {
		console.log(err)
	}
}

app.get('/start', (req, res) => {
	getRandom()
	res.send('OK')
})

app.get('/callback', (req, res) => {
	comparisonCallback(req, res, (number) => {
		console.log(`callback: equal, guess ${number}`)
	})
})

app.get('/promise', (req, res) => {
	comparePromise().then((number) => {
		console.log(`promise: equal, guess ${number}`)
		res.send(`equal, guess ${number}`)
	}).catch((err) => {
		console.log(err)
	})
})

app.get('/async', (req, res) => {
	comparisonAsync(req, res)
})

app.listen(8081)
