const { Pool } = require("pg");
require("dotenv").config();

// Disable SSL for local development, enable for production
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // Adjust based on your security requirements
  },
});

async function connectToDatabase() {
  try {
    // Connect to the database
    const client = await pool.connect();

    // Test the connection by fetching the server version
    const res = await client.query('SELECT version();');
    console.log(`Connected to database. Server version: ${res.rows[0].version}`);

    // Release the client back to the pool
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}
connectToDatabase();

module.exports = pool;

