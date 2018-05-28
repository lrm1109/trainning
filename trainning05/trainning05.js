const request = require('request')
const rp = require('request-promise')

const MAX = 1000000
const comparisonCallback = (minNum, maxNum, callback) => {
	const num = (minNum + maxNum) / 2
	console.log(num)
	request.post(`http://localhost:8081/${num}`, (error, response, body) => {
		if (error) {
			console.log(error)
		}
		if (body === 'equal') {
			callback(num)
		} else if (body === 'bigger') {
			comparisonCallback(minNum, Math.floor(num), callback)
		} else if (body === 'smaller') {
			comparisonCallback(Math.ceil(num), maxNum, callback)
		}
	})
}


const comparePromise = (minNum, maxNum) => new Promise((resolve, reject) => {
	const number = (minNum + maxNum) / 2
	console.log(number)
	const options = { url: `http://localhost:8081/${number}`, method: 'POST' }
	rp(options).then((response) => {
		if (response === 'equal') {
			resolve(number)
		}
		if (response === 'bigger') {
			setTimeout(() => {
				comparePromise(minNum, Math.floor(number)).then(res => resolve(res))
			})
		}
		if (response === 'smaller') {
			setTimeout(() => {
				comparePromise(Math.ceil(number), maxNum).then(res => resolve(res))
			})
		}
	}).catch(() => {
		reject()
	})
})


const comparisonAsync = async (minNum, maxNum) => {
	try {
		const number = (minNum + maxNum) / 2
		console.log(number)
		const options = { url: `http://localhost:8081/${number}`, method: 'POST' }
		const response = await rp(options)
		if (response === 'bigger') {
			return await comparePromise(minNum, Math.floor(number))
		} else if (response === 'smaller') {
			return await comparePromise(Math.ceil(number), maxNum)
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

