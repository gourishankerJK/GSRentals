const express = require("express");
const Fawn = require("fawn");
const { validate, Rental } = require("../models/rental");
const { Customers } = require("../models/customers");
const { Items } = require("../models/items");
const mongoose = require("mongoose");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", async (req, res) => {
	const rentals = await Rental.find().sort("-dateOut");
	res.send(rentals);
});

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	const customer = await Customers.findById(req.body.customerId);
	if (!customer) res.status(400).send("Invalid Customer");
	const item = await Items.findById(req.body.itemId);
	if (!item) res.status(400).send("Invalid item");

	if (item.numberInStock === 0)
		return res.status(400).send("item not in stock");

	const rental = new Rental({
		customer: {
			_id: customer._id,
			name: customer.name,
			isGold: customer.isGold,
			phone: customer.phone,
		},

		item: {
			_id: item._id,
			title: item.title,
			dailyRentalRate: item.dailyRentalRate,
		},
	});

	item.numberInStock--;
	try {
		new Fawn.Task()
			.save("rentals", rental)
			.update(
				"Items",
				{ _id: item._id },
				{
					$inc: {
						numberInStock: -1,
					},
				}
			)
			.run();
		res.send(rental);
	} catch (ex) {
		res.status(500).send("Something went wrong");
	}
});

module.exports = router;
