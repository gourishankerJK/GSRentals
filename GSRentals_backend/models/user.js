const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		maxlength: 50,
	},
	password: {
		type: String,
		required: true,
		maxlength: 1024,
		minlength: 5,
	},
	isAdmin: {
		type: Boolean,
	},
});

userSchema.methods.generateAuthToken = function () {
	return jwt.sign(
		{ _id: this._id, isAdmin: this.isAdmin, name: this.name },
		config.get("jwtPrivateKey")
	);
};
module.exports.User = mongoose.model("users", userSchema);

module.exports.validate = (user) => {
	const schema = {
		name: Joi.string().max(50).min(2).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(5).required(),
	};
	return Joi.validate(user, schema);
};
