const express = require("express");
require("dotenv").config();
// Database connection
const pool = require("./db/dbConfig");

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5500;

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to Evangadi :-");
});

// User-defined routes
const useRoutes = require("./routes/userRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute = require("./routes/answerRoute");

app.use(cors({ origin: ["http://localhost:5173"] })); // Adjust CORS origins as needed

// JSON middleware to parse incoming requests
app.use(express.json());

// Routes middleware
app.use("/api/users", useRoutes);
app.use("/api", questionRoute);
app.use("/api", answerRoute);

async function start() {
  try {
    // Test the database connection
    const result = await pool.query("SELECT 'test' AS result");
    console.log("Database test query result:", result.rows);

    // Start the server
    app.listen(port, () => {
      console.log("Database connected successfully");
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error.message);
    process.exit(1); // Exit the process on a critical error
  }
}

start();
