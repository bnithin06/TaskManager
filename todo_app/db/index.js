const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

// Creating a SQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Testing the connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((error) => console.error('Error connecting to the database:', error));

// Optional: Handle connection end
process.on('exit', () => {
  pool.end(() => {
    console.log('PostgreSQL pool has ended.');
  });
});

module.exports = pool;
