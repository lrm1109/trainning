const request = require('request')
const rp = require('request-promise')

const MAX = 1000000
const comparisonCallback = (minNum, maxNum, callback) => {
	const num = Math.floor((minNum + maxNum) / 2)
	console.log(num)
	request.post(`http://localhost:8081/${num}`, (error, response, body) => {
		if (error) {
			console.log(error)
		}
		if (body === 'equal') {
			callback(num)
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
	try {
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
	} catch (err) {
		console.log(err)
	}
}

async function play() {
	await rp('http://localhost:8081/start')

	comparisonCallback(0, MAX, (num) => {
		console.log(`callback: equal, guess ${num}`)
	})

	comparePromise(0, MAX).then((number) => {
		console.log(`promise: equal, guess ${number}`)
	}).catch((err) => {
		console.log(err)
	})

	console.log(`async: equal, guess ${await comparisonAsync(0, MAX)}`)
}

play()

