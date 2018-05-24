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
