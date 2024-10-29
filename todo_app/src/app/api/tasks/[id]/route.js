import pool from "../../../../../db";

// Handling specific task operations
export async function DELETE(req, { params }) {
  // Await the params to ensure you can access its properties
  const { id } = await params;

  // Log the id for debugging
  console.log(`Deleting task with ID: ${id}`);

  try {
    // Execute the delete operation
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    
    // Check if any rows were affected (i.e., task deleted)
    if (result.rowCount > 0) {
      return new Response(JSON.stringify({ message: 'Task deleted successfully' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      // Task not found
      return new Response(JSON.stringify({ message: 'Task not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error deleting task:', error);

    // Return an internal server error response
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
