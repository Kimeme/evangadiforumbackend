const express = require("express");
const router = express.Router();

const {postQuestion, getAllQuestions, getQuestionAndAnswer} = require("../controller/questionController")

// get all questions
router.get("/question", getAllQuestions);


// get single question
router.get("/question/:question_id", getQuestionAndAnswer);

// post a question
router.post("/question", postQuestion);

module.exports = router;
