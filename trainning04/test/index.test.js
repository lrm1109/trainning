const app = require('../index.js')
const supertest = require('supertest')
const should = require('should')
const _ = require('lodash')

const request = supertest(app)

describe('/start func test', () => {
	it('should return ok', (done) => {
		request.get('/start').end((err, res) => {
			should.not.exist(err)
			res.text.should.equal('OK')
			done(err)
		})
	})
})

describe('/:number func test', () => {
	it('should return bigger, smaller or equal', (done) => {
		request.post('/50').end((err, res) => {
			should.not.exist(err)
			res.text.should.equalOneOf('bigger', 'smaller', 'equal')
			done(err)
		})
	})
})

// function test(num) {
// 	request.post(`/${num}`).end((err, res) => {
// 		if (!err) {
// 			res.text.should.match((n) => {
// 				if (n === 'equal') {
// 					return true
// 				}
// 				const i = _.random(100)
// 				console.log(i)
// 				return test(i)
// 			})
// 		} else {
// 			return false
// 		}
// 	})
// }

// function compareEqual(num) {
// 	return new Promise((resolve, reject) => {
// 		const flag = test(num)
// 		if (flag) {
// 			resolve('equal')
// 		} else {
// 			reject()
// 		}
// 	})
// }

// function compareEqual(num, done) {
// 	request.post(`/${num}`).end((err, res) => {
// 		if (!err) {
// 			res.text.should.match((n) => {
// 				if (n === 'equal') {
// 					res.text.should.equal('equal')
// 					done()
// 				} else {
// 					const i = _.random(100)
// 					console.log(i)
// 					compareEqual(i)
// 				}
// 			})
// 		} else {
// 			done(err)
// 		}
// 	})
// }

function compareEqual(num, done) {
	request.post(`/${num}`).end((err, res) => {
		if (!err) {
			res.text.should.match((n) => {
				if (n === 'equal') {
					done()
				} else {
					const i = _.random(100)
					console.log(i)
					return compareEqual(i, done)
				}
			})
		}
	})
}

describe('play game test', () => {
	before((done) => {
		request.get('/start').end((err, res) => {
			should.not.exist(err)
			res.text.should.equal('OK')
			done(err)
		})
	})
	it('should return equal', (done) => {
		const num = _.random(100)
		// const num = 0
		compareEqual(num, done)
	})
})
