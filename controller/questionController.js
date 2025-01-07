const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const pool = require("../db/dbConfig");
async function postQuestion(req, res) {
  const { userid, title, description, tag } = req.body;

  if (!userid || !title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  const questionid = crypto.randomBytes(10).toString("hex");
  const currentTimestamp = new Date();

  try {
    await pool.query(
      "INSERT INTO questions (questionid, userid, title, description, tag, createdAt) VALUES ($1, $2, $3, $4, $5, $6)",
      [questionid, userid, title, description, tag, currentTimestamp]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Question posted successfully" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later." });
  }
}
async function getAllQuestions(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        q.questionid, q.title, q.description, q.createdAt, u.username 
      FROM 
        questions q
      INNER JOIN 
        users u ON q.userid = u.userid
      ORDER BY 
        q.createdAt DESC
    `);

    return res.status(StatusCodes.OK).json({ questions: result.rows });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later." });
  }
}

async function getQuestionAndAnswer(req, res) {
  const questionid = req.params.question_id;

  try {
    const result = await pool.query(
      `
      SELECT 
        q.questionid, q.title, q.description, q.createdAt AS question_createdAt,
        u2.username AS question_username, a.answerid, a.userid AS answer_userid,
        a.answer, a.createdAt, u.username AS answer_username
      FROM 
        questions q
      LEFT JOIN 
        answers a ON q.questionid = a.questionid
      LEFT JOIN 
        users u ON u.userid = a.userid
      LEFT JOIN 
        users u2 ON u2.userid = q.userid
      WHERE 
        q.questionid = $1
      ORDER BY 
        a.createdAt DESC
      `,
      [questionid]
    );

    if (result.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }

    const questionDetails = {
      id: result.rows[0].questionid,
      title: result.rows[0].title,
      description: result.rows[0].description,
      qtn_createdAt: result.rows[0].question_createdAt,
      qtn_username: result.rows[0].question_username,
      answers: result.rows
        .filter((row) => row.answerid)
        .map((row) => ({
          answerid: row.answerid,
          userid: row.answer_userid,
          username: row.answer_username,
          answer: row.answer,
          createdAt: row.createdAt,
        })),
    };

    return res.status(StatusCodes.OK).json(questionDetails);
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching question details." });
  }
}
module.exports = { postQuestion, getAllQuestions, getQuestionAndAnswer };

