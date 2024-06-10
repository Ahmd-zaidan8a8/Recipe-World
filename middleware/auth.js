const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.get("x-auth-token");
  if (!token) return res.status(401).send("Acces denied. No token Provided.");
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = auth;
  