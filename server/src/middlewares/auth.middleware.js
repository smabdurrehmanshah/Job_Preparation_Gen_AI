const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("./../models/blacklist.model");

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  console.log(token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied! No token provided." });
  }

  try {
    const isTokenBlacklisted = await blacklistTokenModel.findOne({ token });

    if (isTokenBlacklisted) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token!" });
  }
};

module.exports = { verifyToken };
