const Product = require('../models/Product')
const ProductType = require('../models/ProductType')
const { modelName } = require('../models/ProductType')

const mongoDataMethods = {
	getAllProducts: async (condition = null) =>
		condition === null ? await Product.find() : await Product.find(condition),
	getProductById: async id => await Product.findById(id),
	getAllProductTypes: async () => await ProductType.find(),
	getProductTypeById: async id => await ProductType.findById(id),
	createProductType: async args => {
		const newProductType = new ProductType(args)
		return await newProductType.save()
	},
	createProduct: async args => {
		const newProduct = new Product(args)
		return await newProduct.save()
	}
}

module.exports = mongoDataMethods
