const { gql } = require('apollo-server-express')

const typeDefs = gql`
	type Product {
		id: ID!
		name: String
		old_price: String
  		sale_price: String
		producttype: ProductType
		image_128: String
  		image_512: String
  		image_256: String
		createAt:String
		user: User
		discription: String
		carts: [Cart]
		
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
		products: [Product]
		carts:[Cart]
		message:String
		phone:String!
	}

	type Cart{
		id: ID!
		createAt: String!
		user: User
		product: Product
		status: String!

	}

	type SignupInput{
		email: String!
		password:String!
	}

	

	# ROOT TYPE
	type Query {
		products: [Product]
		product(id: ID!): Product
		producttypes: [ProductType]
		producttype(id: ID!): ProductType
		user(id: ID!): User
		cart(id: ID!): Cart
		carts: [Cart]
		

	}
		# someProducts(page: String): [Product!]!
	

	type Mutation {
		createProductType(name: String): ProductType
		createProduct(name: String,old_price: String,sale_price:String,discription:String,image_256: String, 
		producttypeId: ID!, userId: ID!): Product
		signup(email:String!, password: String!, name: String!, phone:String! ): User!
		login(email:String!, password:String!): User!
		createCart(status: String!, productId: String!, userId: String!): Cart
		getUser(email:String!): User!

	}
`

module.exports = typeDefs
