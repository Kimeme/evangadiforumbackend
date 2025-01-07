const { Pool } = require("pg");
require("dotenv").config();

// Disable SSL for local development, enable for production
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  // ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

module.exports = pool;

