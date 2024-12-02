const jwt = require("jsonwebtoken");
require("dotenv").config();

const validUser = (req, res, next) => {
  let token = req.header("token");

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    let decoded = jwt.verify(token, process.env.JWTSECRET);
    if (!decoded) {
      return res.status(401).json({ msg: "Wrong info" });
    }
    req.user = decoded;
    req.app.locals.user = decoded;
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  next();
};

module.exports = validUser;
