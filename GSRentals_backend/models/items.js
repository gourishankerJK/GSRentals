const mongoose = require("mongoose");
const Joi = require("joi");
const { categorySchema } = require("./category");

const Items = mongoose.model(
	"item",
	new mongoose.Schema({
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 255,
		},
		category: {
			type: categorySchema,
			required: true,
		},
		numberInStock: {
			type: Number,
			required: true,
			min: 0,
			max: 255,
		},
		dailyRentalRate: {
			type: Number,
			required: true,
			min: 0,
			max: 255,
		},
	})
);

validate = (item) => {
	const schema = {
		_id: Joi.string(),
		title: Joi.string().required().label("Title"),
		categoryId: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/)
			.required()
			.label("Category"),
		numberInStock: Joi.number()
			.integer()
			.min(0)
			.required()
			.label("Number In Stock"),
		dailyRentalRate: Joi.number().min(0).max(10).required().label("Rate"),
	};
	return Joi.validate(item, schema);
};

module.exports = { Items, validate };
