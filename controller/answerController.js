const { StatusCodes } = require("http-status-codes");
const pool = require("../db/dbConfig");
const crypto = require("crypto");
async function getAnswer(req, res) {
  const questionid = req.params.question_id;

  try {
    const result = await pool.query(
      `
      SELECT 
        a.answerid, a.userid AS answer_userid, a.answer, u.username
      FROM 
        answers a
      INNER JOIN 
        users u ON a.userid = u.userid
      WHERE 
        a.questionid = $1
      `,
      [questionid]
    );

    return res.status(StatusCodes.OK).json({ answers: result.rows });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later." });
  }
}
async function postAnswer(req, res) {
  const { userid, answer, questionid } = req.body;

  if (!userid || !answer || !questionid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  const currentTimestamp = new Date();

  try {
    await pool.query(
      "INSERT INTO answers (userid, answer, questionid, createdAt) VALUES ($1, $2, $3, $4)",
      [userid, answer, questionid, currentTimestamp]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Answer posted successfully" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later." });
  }
}
module.exports = {getAnswer,postAnswer};

