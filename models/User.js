const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	name: {
		type: String
	},
	phone: {
		type: String
	},
	password:{
		type:String},

	email: {
		type: String
	},
	createAt:{
		type: String
	},
	status: {
		type: String, 
		enum: ['Chờ kích hoạt', 'Đã kích hoạt'],
		default: 'Chờ kích hoạt'
	  },
	  confirmationCode: { 
		type: String, 
		unique: true }
})

module.exports = mongoose.model('user', UserSchema)
