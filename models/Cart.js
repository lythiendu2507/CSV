const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CartSchema = new Schema({
	createAt:{
		type:String
	},
	userId:{
		type:String
	},
    productId:{
        type:String
    },
    status: {
       tyoe: String
    }

})

module.exports = mongoose.model('cart', CartSchema)
