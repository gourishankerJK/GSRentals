const express = require("express");
const router = express.Router();
const { Items, validate } = require("../models/items");
const validateObjectId = require("../middleware/validateObjectId");
const { Category } = require("../models/category");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
	const result = await Items.find().sort("title");
	res.send(result);
});

router.post("/", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const category = await Category.findById(req.body.categoryId);
	if (!category) return res.status(400).send("Invalid categoryId");
	const item = new Items({
		title: req.body.title,
		category: {
			_id: category._id,
			name: category.name,
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate,
	});
	await item.save();
	return res.send(item);
});

router.put("/:id", auth, async (req, res) => {
	const { error } = validate(req.body);

	if (error) return res.status(400).send(error.details[0].message);
	const category = await Category.findById(req.body.categoryId);
	if (!category) return res.status(400).send("Invalid categoryId");
	const item = await Items.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			category: {
				_id: category._id,
				name: category.name,
			},
			numberInStock: req.body.numberInStock,
			dailyRentalRate: req.body.dailyRentalRate,
		},
		{
			new: true,
		}
	);
	res.send(item);
});

router.delete("/:id", [auth, admin], async (req, res) => {
	const item = await Items.deleteOne({ _id: req.params.id });
	if (!item)
		return res.status(404).send("The item with the given ID was not found.");
	res.send(item);
});

router.get("/:id", validateObjectId, async (req, res) => {
	const item = await Items.findById(req.params.id);
	if (!item)
		return res.status(404).send("The item with the given ID was not found.");

	res.send(item);
});

module.exports = router;
