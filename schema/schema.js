const { gql } = require('apollo-server-express')

const typeDefs = gql`
	type Product {
		id: ID
		name: String
		old_price: String
  		sale_price: String
		producttype: ProductType
		image_128: String
  		image_512: String
  		image_256: String
		date_up:String
		description: String
	}

	type ProductType {
		id: ID!
		name: String
		products: [Product]
	}

	# ROOT TYPE
	type Query {
		products(condition:String): [Product]
		product(id: ID!): Product
		producttypes: [ProductType]
		producttype(id: ID!): ProductType
		someProducts(page: String): [Product!]!
	}

	type Mutation {
		createProductType(name: String): ProductType
		createProduct(name: String,price: Float, producttypeId: ID!): Product
	}
`

module.exports = typeDefs
