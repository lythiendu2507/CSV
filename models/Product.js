const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
	name: {
		type: String
	},
	price: {
		type: String
	},
	producttypeId: {
		type: String
	}
})

module.exports = mongoose.model('products', ProductSchema)
