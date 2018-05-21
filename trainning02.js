const express = require('express')

const app = express()
let R
app.get('/start', (req, res) => {
	R = Number(Math.random() * 100).toFixed(0)
	console.log(R)
	res.send('OK!')
})

app.get('/:number', (req, res) => {
	const number = Number(req.params.number)
	if (number > R) {
		res.send('bigger')
	} else if (number < R) {
		res.send('smaller')
	} else {
		res.send('equal')
	}
}).listen(8081)

