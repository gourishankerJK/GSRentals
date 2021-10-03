const category = require("../routes/category");
const express = require("express");
const customers = require("../routes/customers");
const items = require("../routes/items");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");
const returns = require("../routes/returns");
module.exports = function (app) {
	app.use((req, res, next) => {
		res.header({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": ["GET", "POST", "PUT", "DELETE"],
			"Access-Control-Allow-Headers": ["content-type", "x-auth-token"],
		});
		next();
	});
	app.use(express.json());
	app.use("/api/category", category);
	app.use("/api/customers", customers);
	app.use("/api/items", items);
	app.use("/api/rentals", rentals);
	app.use("/api/returns", returns);
	app.use("/api/users", users);
	app.use("/api/auth", auth);
	app.use(error);
};
