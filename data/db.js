const Product = require('../models/Product')
const ProductType = require('../models/ProductType')
const { modelName } = require('../models/ProductType')
const User = require('../models/User')
const Cart = require('../models/Cart')


const mongoDataMethods = {
	getAllProducts: async () => await Product.find(),
	getProductById: async id => await Product.findById(id),

	getAllProductTypes: async () => await ProductType.find(),
	getProductTypeById: async id => await ProductType.findById(id),

	getUserById: async id =>await User.findById(id),

	getCartByID: async id =>await Cart.findById(id),
	getAllCart: async () => await Cart.find(),

	getEmail: async email => await User.findOne(email),
	createCart: async ({status, productId, userId}) =>{
		const newCart = new Cart({
		status, productId, userId,
			createAt: new Date().toISOString()
		})
		return await newCart.save()
	},
	createProductType: async args => {
		const newProductType = new ProductType(args)
		return await newProductType.save()
	},
	createProduct: async ({name,old_price,sale_price,discription, producttypeId, userId,image_256}) => {
		const newProduct = new Product({
			name,old_price,sale_price,discription, producttypeId, userId,image_256,
			createAt: new Date().toISOString()
		})
		return await newProduct.save()
	},
	createUser: async args =>{
		const newUser = new User(args)
		return await newUser.save()
	}
	
}

module.exports = mongoDataMethods
