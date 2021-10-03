const winston = require("winston");
module.exports = () => {
	winston.exceptions.handle(
		new winston.transports.File({ filename: "logs/uncaughtException.json" })
	);
	process.on("unhandledRejection", (ex) => {
		throw ex;
	});
	winston.add(
		new winston.transports.File({
			filename: "logs/logfile.log",
		})
	);
};
