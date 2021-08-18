const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LoginSchema = new Schema({
	email: {
		type: String
	},
	
	password:{
		type:String},

	authdata: {
		type: String
	}
})

module.exports = mongoose.model('login', LoginSchema)
