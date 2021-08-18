const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
	name: {
		type: String
	},
	old_price: {
		type: String
	},
	sale_price: {
		type: String
	},
	image_128: {
		type:String},

  	image_512: {
		  type:String},

  	image_256: {
		  type:String},

	date_up:{
		type:String},

	discription: {
		type: String
	},
	producttypeId: {
		type: String
	}
})

module.exports = mongoose.model('products', ProductSchema)
