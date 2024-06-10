const express = require("express");
const morgan = require("morgan");
require('dotenv').config();

const app = express();
require("./startup/routes")(app);
require("./startup/db")();

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan Enabeld..");
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listining on port ${port}...`));
