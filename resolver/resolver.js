const { create } = require("../models/Product")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const mongoDataMethods = require("../data/db")
const SECRET_KEY = "MOBA"
const { UserInputError } = require('apollo-server-express')
const checkAuth = require('../ulti/check-auth')
const validator = require('validator')

const {validateSignupInput, validateLoginInput} = require('../ulti/validators')



function gererateToken(user){
	return jwt.sign({
		id: user.id,
		email: user.email,

	}, SECRET_KEY, { expiresIn: '1h' })

}
const resolvers = {
	// QUERY
	Query: {
		products: async (parent, args, { mongoDataMethods }) =>
			await mongoDataMethods.getAllProducts(),
		product: async (parent, { id }, { mongoDataMethods }) =>
			await mongoDataMethods.getProductById(id),

		cart: async (parent, args, { mongoDataMethods }) =>
			await mongoDataMethods.getCartById(id),
		carts: async (parent, args, { mongoDataMethods }) =>
			await mongoDataMethods.getAllCart(),
			
		producttypes: async (parent, args, { mongoDataMethods }) =>
			await mongoDataMethods.getAllProductTypes(),
		producttype: async (parent, { id }, { mongoDataMethods }) =>
			await mongoDataMethods.getProductTypeById(id),

		user: async (parent, { id }, { mongoDataMethods }) =>
			await mongoDataMethods.getUserById(id),

	},




	Product: {
		producttype: async ({ producttypeId }, args, { mongoDataMethods }) =>
			await mongoDataMethods.getProductTypeById(producttypeId),
		user: async ({ userId }, args, { mongoDataMethods }) =>
			await mongoDataMethods.getUserById(userId),
		carts: async ({ id }, args, { mongoDataMethods }) =>
			await mongoDataMethods.getAllCart({ cartId: id })
	},

	ProductType: {
		products: async ({ id }, args, { mongoDataMethods }) =>
			await mongoDataMethods.getAllProducts({ producttypeId: id })
	},

	User: {
		products: async ({ id }, args, { mongoDataMethods }) =>
			await mongoDataMethods.getAllProducts({ userId: id }),
		carts: async ({ id }, args, { mongoDataMethods }) =>
			await mongoDataMethods.getAllCart({ cartId: id })
	},
	Cart: {
		product: async ({ productId }, args, { mongoDataMethods }) =>
			await mongoDataMethods.getProductById(productId),
		user: async ({ userId }, args, { mongoDataMethods }) =>
			await mongoDataMethods.getUserById(userId)
	},

	// MUTATION
	Mutation: {
		createProductType: async (parent, args, { mongoDataMethods }) =>
			await mongoDataMethods.createProductType(args),

		createProduct: async (parent, args, { mongoDataMethods }) =>
			await mongoDataMethods.createProduct(args),

		createCart: async (parent, args, { mongoDataMethods }) =>
			await mongoDataMethods.createCart(args),
		async getUser(_,{email}){
			const user = await  User.findOne({email})
			
			return {
				...user._doc,
				id: user._id,
				
				
			}
		},

		async login(_,{email,password}){
			const error = ''
			const {errors, valid} = validateLoginInput(email,password)
			if(!valid) {
				throw new UserInputError('Errors',{errors})
				error = errors
			}
			const user = await  User.findOne({email})
			if(!user){
				errors.general = 'Email không khả dụng'
				throw new UserInputError('Errors',{errors})
				error = errors
			}
			
			const match = await bcrypt.compare(password, user.password)
			if(!match){
				errors.general = 'Mật khẩu không khả dụng'
				throw new UserInputError('Errors', {errors})
				error = errors
			}
			const token = gererateToken(user)

			return {
				...user._doc,
				id: user._id,
				token,
				message: error
				
			}
		},

		async signup(_, { email, password, name, phone }) {

			const error = ''
			const{ valid, errors} = validateSignupInput(email, password, name, phone)
			if(!valid){
				throw new UserInputError('Errors', {errors})
				error = errors
			}
			const user = await User.findOne({ email });
			
			const specialEmail = /^[a-zA-Z0-9\.\_\@\-]*$/;
			const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			
			if (email && specialEmail.test(email) && reg.test(email)) {
				if (user) {
					throw new UserInputError('Email đã được sử dụng', {
						errors: {
							email: 'Email đã được sử dụng'
						}
					})
					error = errors
				}
			}
			else {
				return new UserInputError('Email không hợp lệ', {
					errors: {
						email: 'Email không hợp lệ'
					}
				});
				error = errors
			}
			


			password = await bcrypt.hash(password, 12)
			const newUser = new User({
				email,
				password,
				name,
				phone,
				createAt: new Date().toISOString()
			})

			const res = await newUser.save()

			const token = gererateToken(res)

			return {
				...res._doc,
				id: res._id,
				token,
				message: error
			}
		}

	}
}

module.exports = resolvers
