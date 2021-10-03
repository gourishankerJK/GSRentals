const Joi = require("joi");
const { mongoose } = require("../database/connect");

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 50,
	},
});
const Category = mongoose.model("category", categorySchema);

validate = (category) => {
	const schema = {
		name: Joi.string().min(3).required(),
	};
	return Joi.validate(category, schema);
};

module.exports = {
	Category,
	validate,
	categorySchema,
};
