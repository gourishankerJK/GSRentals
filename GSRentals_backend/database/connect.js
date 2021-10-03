const mongoose = require("mongoose");
const config = require("config");
const connectDB = async () => {
	const url = config.get("dbUrl");
	mongoose
		.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		})
		.then(() => console.log("Connected to MongoDB"));
};
module.exports = { mongoose, connectDB };
