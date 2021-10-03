const config = require("config");
module.exports = () => {
	if (!config.get("jwtPrivateKey")) {
		console.error("Fatal error : jwtKey is not defined");
		process.exit(1);
	}
};
