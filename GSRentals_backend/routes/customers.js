const express = require("express");
const router = express.Router();
const { Customers, validate } = require("../models/customers");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
	const result = await Customers.find().sort("name");
	res.send(result);
});

router.post("/", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	const customer = new Customers({
		name: req.body.name,
		isGold: req.body.isGold,
		phone: req.body.phone,
	});
	await customer.save();
	return res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
	const { error } = validate(req.body);

	if (error) return res.status(400).send(error.details[0].message);
	const customer = await Customers.findByIdAndUpdate(
		req.params.id,
		{
			name: req.body.name,
			isGold: req.body.isGold,
			phone: req.body.phone,
		},
		{
			new: true,
		}
	);
	if (!customer)
		return res
			.status(404)
			.send("The customer with the given ID was not found.");
	res.send(customer);
});

router.delete("/:id", async (req, res) => {
	const customer = await Customers.deleteOne({ _id: req.params.id });
	if (!customer)
		return res
			.status(404)
			.send("The customer with the given ID was not found.");
	res.send(customer);
});

router.get("/:id", async (req, res) => {
	const customer = await Customers.findById(req.params.id);
	if (!customer)
		return res
			.status(404)
			.send("The customer with the given ID was not found.");
	res.send(customer);
});

module.exports = router;
