const query = require('../config/mysql')

const findByNamePwd = async (params) => {
	const sql = 'select * from user where username = ? and password = ?'
	const rows = await query(sql, params)

	return rows
}

module.exports = {
	findByNamePwd,
}
