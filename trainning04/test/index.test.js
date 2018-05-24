const app = require('../index.js')
const should = require('should')
// const request = require('supertest')
const http_mocks = require('node-mocks-http')

function buildResponse() {
	return http_mocks.createResponse({ eventEmitter: require('events').EventEmitter })
}

describe('/start func test', () => {
	it('should return ok', (done) => {
		const response = buildResponse()
		const request = http_mocks.createRequest({
			method: 'GET',
			url: '/start',
		})

		response.on('end', () => {
			response._getData().should.equal('OK')
			done()
		})

		app.handle(request, response)
	})
})

describe('/:number func test', () => {
	it('should return bigger, smaller or equal', (done) => {
		const response = buildResponse()
		const request = http_mocks.createRequest({
			method: 'POST',
			url: '/50',
		})

		response.on('end', () => {
			response._getData().should.equalOneOf('bigger', 'smaller', 'equal')
			done()
		})

		app.handle(request, response)
	})
})
