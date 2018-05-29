const request = require('request')
const rp = require('request-promise')
const util = require('util')

const MAX = 1000000
const comparisonCallback = (minNum, maxNum, callback) => {
	const num = Math.floor((minNum + maxNum) / 2)
	console.log(num)
	request.post(`http://localhost:8081/${num}`, (error, response, body) => {
		if (body === 'equal') {
			callback(error, num)
		} else if (body === 'bigger') {
			comparisonCallback(minNum, num, callback)
		} else if (body === 'smaller') {
			comparisonCallback(num, maxNum, callback)
		}
	})
}

const comparePromise = (minNum, maxNum) => {
	const number = Math.floor((minNum + maxNum) / 2)
	console.log(number)
	const options = { url: `http://localhost:8081/${number}`, method: 'POST' }
	return rp(options).then((response) => {
		if (response === 'bigger') {
			return comparePromise(minNum, number)
		} else if (response === 'smaller') {
			return comparePromise(number, maxNum)
		}
		return number
	})
}


const comparisonAsync = async (minNum, maxNum) => {
	const number = Math.floor((minNum + maxNum) / 2)
	console.log(number)
	const options = { url: `http://localhost:8081/${number}`, method: 'POST' }
	const response = await rp(options)
	if (response === 'bigger') {
		return await comparePromise(minNum, number)
	} else if (response === 'smaller') {
		return await comparePromise(number, maxNum)
	}
	return number
}


const play = async () => {
	await rp('http://localhost:8081/start')

	const callbackToPromise = util.promisify(comparisonCallback)

	try {
		let num = await callbackToPromise(0, MAX)
		console.log(`callback: equal, guess ${num}`)

		await comparePromise(0, MAX).then((number) => {
			console.log(`promise: equal, guess ${number}`)
		})

		num = await comparisonAsync(0, MAX)
		console.log(`async: equal, guess ${num}`)
	} catch (err) {
		console.log('Error', err)
	}
}

play().catch((err) => {
	console.log(err)
})

