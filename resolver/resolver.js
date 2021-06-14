const resolvers = {
	// QUERY
	Query: {
		products: async (parent, args, { mongoDataMethods }) =>
			await mongoDataMethods.getAllProducts(),
		product: async (parent, { id }, { mongoDataMethods }) =>
			await mongoDataMethods.getProductById(id),

		producttypes: async (parent, args, { mongoDataMethods }) =>
			await mongoDataMethods.getAllProductTypes(),
		producttype: async (parent, { id }, { mongoDataMethods }) =>
			await mongoDataMethods.getProductTypeById(id)
	},

	Product: {
		producttype: async ({ producttypeId }, args, { mongoDataMethods }) =>
			await mongoDataMethods.getProductTypeById(producttypeId)
	},

	ProductType: {
		products: async ({ id }, args, { mongoDataMethods }) =>
			await mongoDataMethods.getAllProducts({ producttypeId: id })
	},

	// MUTATION
	Mutation: {
		createProductType: async (parent, args, { mongoDataMethods }) =>
			await mongoDataMethods.createProductType(args),
		createProduct: async (parent, args, { mongoDataMethods }) =>
			await mongoDataMethods.createProduct(args)
	}
}

module.exports = resolvers
