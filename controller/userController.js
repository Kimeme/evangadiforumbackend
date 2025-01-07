const pool = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required information" });
  }

  try {
    const result = await pool.query(
      "SELECT username, userid FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (result.rows.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "User already registered" });
    }

    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  try {
    const result = await pool.query(
      "SELECT username, userid, password FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid username or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid username or password" });
    }

    const token = jwt.sign(
      { username: user.username, userid: user.userid },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(StatusCodes.OK).json({
      msg: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}
function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;

  return res.status(StatusCodes.OK).json({ username, userid });
}
module.exports = {register,login,checkUser}

// // these component used to "for big project there is MVC...the arctict folder structure module(database),view(front end or cliant),controller" found in back-end and communicate with database

