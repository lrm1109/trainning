const mysql = require('mysql')
const config = require('./db')

// 数据库连接
const pool = mysql.createPool(config.db)

const query = (sql, params) => new Promise((resolve, reject) => {
	pool.getConnection((err, connection) => {
		if (err) {
			reject(err)
		} else {
			connection.query(sql, params, (error, rows) => {
				connection.release()
				if (error) {
					reject(error)
				} else {
					resolve(rows)
				}
			})
		}
	})
})

module.exports = query
