const express = require("express");
const { User, validate } = require("../models/user");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
	const user = await User.findById(req.user._id).select("-password");
	res.send(user);
});

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	let user = await User.findOne({ email: req.body.email });

	if (user) return res.status(400).send("User is already registered");
	const salt = await bcrypt.genSalt(10);
	user = new User(_.pick(req.body, ["name", "email", "password"]));
	const hashed = await bcrypt.hash(req.body.password, salt);
	user.password = hashed;
	await user.save();
	const token = user.generateAuthToken();
	res
		.header("x-auth-token", token)
		.header("access-control-expose-headers", "x-auth-token")
		.send(_.pick(user, ["name", "email"]));
});

module.exports = router;
