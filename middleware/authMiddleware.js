const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication Invalid" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    // Verify the token and extract user details
    const { username, userid } = jwt.verify(token, secret);

    // Attach user info to the request object
    req.user = { username, userid };

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
}

module.exports = authMiddleware;

