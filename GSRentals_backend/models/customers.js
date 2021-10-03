const Joi = require("joi");
const { mongoose } = require("../database/connect");

const Customers = mongoose.model(
	"customer",
	new mongoose.Schema({
		name: {
			type: String,
			required: true,
		},
		isGold: {
			type: Boolean,
			default: false,
		},
		phone: {
			type: String,
			minlength: 5,
			required: true,
		},
	})
);

validate = (customer) => {
	const schema = {
		name: Joi.string().required(),
		phone: Joi.string().min(5).required(),
		isGold: Joi.boolean(),
	};
	return Joi.validate(customer, schema);
};

module.exports = {
	Customers,
	validate,
};
