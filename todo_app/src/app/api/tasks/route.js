
import pool from "../../../../db";


// fetching details from backend
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



// adding new Task
export async function POST(req) {
  try {
    // Parse the JSON body from the request
    const data = await req.json();
    
    // Extract task details from the request body
    const {
      title,
      description,
      start_date,
      end_date,
      recurrence_type,
      recurrence_interval,
      days_of_week,
    } = data;

    // Validate required fields
    if (!title || !start_date) {
      return new Response(
        JSON.stringify({ message: 'Title and start date are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert the task into the database
    const insertQuery = `
      INSERT INTO tasks (title, description, start_date, end_date, recurrence_type, recurrence_interval, days_of_week)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, created_at;
    `;

    const values = [
      title,
      description,
      start_date,
      end_date || null, // Allow end_date to be null if not provided
      recurrence_type || null,
      recurrence_interval || null,
      days_of_week || null,
    ];

    const result = await pool.query(insertQuery, values);

    // Respond with the created task data
    return new Response(JSON.stringify({
      message: 'Task created successfully',
      task: result.rows[0],
    }), {
      status: 201, // Created
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error inserting task:', error);
    
    // Handle errors and respond with an error status
    return new Response(JSON.stringify({
      message: 'Error creating task',
      error: error.message,
    }), {
      status: 500, // Internal Server Error
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}