const cors = require("cors");
require("dotenv").config();

const CLIENT_IP_ADDRESS = process.env.CLIENT_IP_ADDRESS || "http://localhost:5173"
module.exports = cors({
  origin: [CLIENT_IP_ADDRESS],
});
