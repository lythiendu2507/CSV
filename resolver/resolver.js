const { create } = require("../models/Product")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const mongoDataMethods = require("../data/db")
const SECRET_KEY = "MOBA"
const { UserInputError } = require('apollo-server-express')
const checkAuth = require('../ulti/check-auth')
const validator = require('validator')
const nodemailer = require("nodemailer");
const {validateSignupInput, validateLoginInput} = require('../ulti/validators')



function gererateToken(user){
	return jwt.sign({
		id: user.id,
		email: user.email,

	}, SECRET_KEY, { expiresIn: '1h' })

}

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "thiendu2507@gmail.com",
    pass:  "0125789364",
  },
});
function sendConfirmationEmail (name, email, confirmationCode){
    console.log("Check");
    transport.sendMail({
      from: "thiendu2507@gmail.com",
      to: email,
      subject: "Hãy xác thực tài khoản của bạn",
      html: `<h1>Xác thực email</h1>
          <h2>xin chào ${name}</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản của website chợ sinh viên Ptit. Để kích hoạt tài khoản hãy bấm váo đường dẫn bên dưới.</p>
          <a href=http://localhost:3000/confirm/${confirmationCode}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
};


exports.verifyUser = (req, res, next) => {
	User.findOne({
	  confirmationCode: req.params.confirmationCode,
	})
	  .then((user) => {
		if (!user) {
		  return res.status(404).send({ message: "Không tìm thấy tài khoản." });
		}
  
		user.status = "Đã kích hoạt";
		user.save((err) => {
		  if (err) {
			res.status(500).send({ message: err });
			return;
		  }
		});
	  })
	  .catch((e) => console.log("error", e));
  };



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
			

			if(user.status !=="Active"){
				errors.general = 'Email chưa được kích hoạt'
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
			const reg = /^[A-Za-z0-9]+[A-Za-z0-9]*@student.ptithcm.edu.vn$/;
			
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
				return new UserInputError('Email không hợp lệ, lưu ý: bạn phải sử dụng email mà nhà trường cấp', {
					errors: {
						email: 'Email không hợp lệ, lưu ý: bạn phải sử dụng email mà nhà trường cấp'
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
				createAt: new Date().toISOString(),
				status: "Chờ kích hoạt",
				confirmationCode: "abcd"
			})

			// nodemailer.sendConfirmationEmail(
			// 	newUser.name,
			// 	newUser.email,
			// 	newUser.confirmationCode)


			transport.sendMail({
				from: "thiendu2507@gmail.com",
				to: newUser.email,
				subject: "Hãy xác thực tài khoản của bạn",
				html: `<h1>Xác thực email</h1>
					<h2>xin chào ${newUser.name}</h2>
					<p>Cảm ơn bạn đã đăng ký tài khoản của website chợ sinh viên Ptit. Để kích hoạt tài khoản hãy bấm váo đường dẫn bên dưới.</p>
					<a href=http://localhost:3000/confirm/${newUser.confirmationCode}> Click here</a>
					</div>`,
			  }).catch(err => console.log(err));

			const res = await newUser.save()
			
			console.log("Tài khoản của bạn đã được đăng ký, hãy vào email của bạn để kích hoạt tài khoản!!!")
			
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



