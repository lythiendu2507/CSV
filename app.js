const express = require('express')
module.exports = require("jwt-decode");
const { ApolloServer } = require('apollo-server-express')
const mongoose = require('mongoose')
const cors = require('cors')

// Load schema & resolvers
const typeDefs = require('./schema/schema')
const resolvers = require('./resolver/resolver')

// Load db methods
const mongoDataMethods = require('./data/db')
const { formatError } = require('graphql')

// Connect to MongoDB
const connectDB = async () => {
	try {
		await mongoose.connect('mongodb+srv://thiendu2507:0125789364@chosinhvien.ei9xn.mongodb.net/chosinhvien?retryWrites=true&w=majority', {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		})

		console.log('MongoDB connected')
	} catch (error) {
		console.log(error.message)
		process.exit(1)
	}
}

connectDB()

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: () => ({ mongoDataMethods })
})

const app = express()
app.use(cors()
// ,{
// 	formatError(err){
// 		if(!err.originalError){
// 			return err
// 		}
// 		const data = err.originalError.data
// 		const message = err.message || 'Một lỗi đã xảy ra'
// 		const code = err.originalError.code || 500
// 		return {message: message, status:code , data: data}
// }}
)

server.applyMiddleware({ app })

app.listen({ port: process.env.PORT || 4000 }, () =>
	console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
)
