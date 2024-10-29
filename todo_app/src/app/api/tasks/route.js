
import pool from "../../../../db";

export async function GET(req) {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC'); // Adjust the column as necessary
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return new Response('Server error', { status: 500 });
  }
}