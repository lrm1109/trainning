const app = require('../index.js')
const supertest = require('supertest')
const should = require('should')

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

function compareEqual(num) {
	return new Promise((resolve, reject) => {
		request.post(`/${num}`).end((err, res) => {
			if (res.text.should.equalOneOf('bigger', 'smaller', 'equal')) {
				res.text.should.match((n) => {
					if (n === 'equal') {
						resolve('equal')
					} else {
						compareEqual(Number(Math.random() * 100).toFixed(0))
					}
				})
			} else {
				reject()
			}
		})
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
	it('should return equal', () => {
		const num = Number(Math.random() * 100).toFixed(0)
		compareEqual(num).should.be.fulfilledWith('equal')
	})
})
