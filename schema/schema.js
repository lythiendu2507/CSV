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

	type User {
		id: ID!
		name: String!
		token: String!
		email: String!
		password: String!
		createAt: String!
	}
	type SignupInput{
		email: String!
		password:String!
	}

	

	# ROOT TYPE
	type Query {
		products(condition:String): [Product]
		product(id: ID!): Product
		producttypes: [ProductType]
		producttype(id: ID!): ProductType
		user(id: ID!): User

	}
		# someProducts(page: String): [Product!]!
	

	type Mutation {
		createProductType(name: String): ProductType
		createProduct(name: String,old_price: Float,sale_price:Float,discription:String, producttypeId: ID!): Product
		signup(email:String!, password: String! ): User!
		login(email:String!, password:String!): User!

	}
`

module.exports = typeDefs
