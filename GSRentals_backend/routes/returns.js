const Joi = require("joi");
const validate = require("../middleware/validate");
const { Rental } = require("../models/rental");
const { Items } = require("../models/items");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
	console.log(Rental);
	const rental = await Rental.lookup(req.body.customerId, req.body.itemId);

	if (!rental) return res.status(404).send("Rental not found.");

	if (rental.dateReturned)
		return res.status(400).send("Return already processed.");

	rental.return();
	await rental.save();

	await Items.update(
		{ _id: rental.item._id },
		{
			$inc: { numberInStock: 1 },
		}
	);

	return res.send(rental);
});

function validateReturn(req) {
	const schema = {
		customerId: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/)
			.required(),
		itemId: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/)
			.required(),
	};

	return Joi.validate(req, schema);
}

module.exports = router;
