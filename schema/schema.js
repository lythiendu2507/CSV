const { gql } = require('apollo-server-express')

const typeDefs = gql`
	type Product {
		id: ID
		name: String
		price: String
		producttype: ProductType
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
	}

	type Mutation {
		createProductType(name: String): ProductType
		createProduct(name: String,price: Float, producttypeId: ID!): Product
	}
`

module.exports = typeDefs
