const express = require("express");
const app = express();
require("./startup/logging")();
require("./startup/config");
require("./middleware/async");
require("./startup/routes")(app);
require("./database/connect")();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
