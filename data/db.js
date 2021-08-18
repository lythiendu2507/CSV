const Product = require('../models/Product')
const ProductType = require('../models/ProductType')
const { modelName } = require('../models/ProductType')
const User = require('../models/User')

const mongoDataMethods = {
	getAllProducts: async (condition = null) =>
		condition === null ? await Product.find() : await Product.find(condition),
	getProductById: async id => await Product.findById(id),
	getAllProductTypes: async () => await ProductType.find(),
	getProductTypeById: async id => await ProductType.findById(id),
	getUserById: async id => User.findById(id),
	getEmail: async email => User.findOne(email),
	createProductType: async args => {
		const newProductType = new ProductType(args)
		return await newProductType.save()
	},
	createProduct: async args => {
		const newProduct = new Product(args)
		return await newProduct.save()
	},
	createUser: async args =>{
		const newUser = new User(args)
		return await newUser.save()
	}
	
}

module.exports = mongoDataMethods
