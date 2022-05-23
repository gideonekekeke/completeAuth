const userModel = require("../Models/AuthModel");
const verifyModel = require("../Models/verifiesModel");
const cloudinary = require("../utils/CloudinaryConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "ajmarketplace52@gmail.com",
		pass: "ajmarketplace",
	},
});

const getUser = async (req, res) => {
	try {
		const users = await userModel.find();

		res.status(200).json({
			message: "successfully retrieved",
			data: users,
		});
	} catch (err) {
		res.status(404).json({
			message: err.message,
		});
	}
};
const CreateUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const salt = await bcrypt.genSalt(10);

		const hash = await bcrypt.hash(password, salt);

		const Image = await cloudinary.uploader.upload(req.file.path);

		const user = await userModel.create({
			name,
			email,
			password: hash,
			avatar: Image.secure_url,
			avatarID: Image.public_id,
		});

		const createToken = crypto.randomBytes(32).toString("hex");
		const testToken = crypto.randomBytes(4).toString("binary");
		const getToken = await jwt.sign(
			{ createToken },
			"THisIsTHEScreTEtoOpenThisAPp",
			{ expiresIn: "20m" },
		);

		await verifyModel.create({
			token: getToken,
			userID: user._id,
			_id: user._id,
		});

		mailOptions = {
			from: "ajmarketplace52@gmail.com",
			to: email,
			subject: "registration successful",
			html: `
                    <h3>This is to verify your account , please click the link to finish up your verification</h3>
                     <a href="http://localhost:4000/api/user/${user._id}/${getToken}"> click  </a> another otp ${testToken}
                    `,
		};

		transport.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err.message);
			} else {
				console.log("mail sent", info.response);
			}
		});

		res.status(201).json({
			message: "Please check your email for completed registration",
		});
	} catch (err) {
		res.status(404).json({
			message: err.message,
		});
	}
};

const getingToken = async (req, res) => {
	try {
		// gett the user by id
		const user = await userModel.findById(req.params.id);
		if (user) {
			//update the verify
			await userModel.findByIdAndUpdate(
				req.params.id,
				{
					verified: true,
					myToken: req.params.token,
				},
				{ new: true },
			);

			// remove the token
			await verifyModel.findByIdAndUpdate(
				user._id,
				{
					token: "",
					userID: user._id,
				},
				{ new: true },
			);

			res.status(200).json({
				message: "user has been authorized you can now login",
			});
		} else {
			res.status(404).json({
				message: "user not authorized",
			});
		}
	} catch (err) {
		res.status(404).json({
			message: err.message,
		});
	}
};

const signinUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await userModel.findOne({ email });

		if (user) {
			const checkpassword = await bcrypt.compare(password, user.password);

			if (checkpassword) {
				if (user.verified && user.myToken !== "") {
					const token = jwt.sign(
						{
							_id: user._id,
						},
						"ThisIsNEWscrETEkEYfORuSErLogIN",
						{ expiresIn: "2d" },
					);
					const { password, info } = user._doc;

					res.status(200).json({
						message: "welcome Back",
						data: { token, ...info },
					});
				} else {
					const createToken = crypto.randomBytes(32).toString("hex");

					const getToken = await jwt.sign(
						{ createToken },
						"THisIsTHEScreTEtoOpenThisAPp",
						{ expiresIn: "20m" },
					);
					mailOptions = {
						from: "ajmarketplace52@gmail.com",
						to: email,
						subject: "registration successful",
						html: `
                    <h3>This is to verify your account , please click the link to finish up your verification</h3>
                     <a href="http://localhost:4000/api/user/${user._id}/${getToken}"> click  </a> another otp 
                    `,
					};

					transport.sendMail(mailOptions, (err, info) => {
						if (err) {
							console.log(err.message);
						} else {
							console.log("mail sent", info.response);
						}
					});

					res.status(201).json({
						message: "Please check your email for completed registration",
					});
				}
			} else {
				res.status(404).json({ message: "password is incorrect" });
			}
		} else {
			res.status(404).json({ message: "user with this email does not exist" });
		}
	} catch (err) {
		res.status(404).json({
			message: err.message,
		});
	}
};

module.exports = {
	getUser,
	CreateUser,
	getingToken,
	signinUser,
};
