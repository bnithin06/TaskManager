"use client"; // This indicates that the component is a client component in Next.js
import React, { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext'; // Import the TaskContext for state management

const TaskList = () => {
  const { tasks} = useContext(TaskContext); // Destructure tasks and setTasks from TaskContext
  const [statusMessage, setStatusMessage] = useState(''); // State for status messages

  // Function to handle task deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, { 
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task'); // Improved error handling
      }

      // Update the tasks state by filtering out the deleted task
      setStatusMessage('Task deleted successfully!'); // Set a success message

      // Reset the status message after 3 seconds
      setTimeout(() => {
        setStatusMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting task:', error); // Log the error for debugging
      setStatusMessage(`Error deleting task: ${error.message}`); // Set a more detailed error message
    }
  };

  return (
    <div className="w-1/2 mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      {statusMessage && <div className="mb-4 text-green-600">{statusMessage}</div>} {/* Display status message if exists */}
      {tasks.length > 0 ? ( // Check if there are tasks available
        <ul className="list-disc pl-5">
          {tasks.map((task) => ( // Map through tasks and render each task
            <li key={task.id} className="flex justify-between items-center mb-2">
              <div>
                <strong>{task.title}</strong><br />
                <span>{task.description}</span><br />
                <span>Start: {new Date(task.start_date).toLocaleDateString()} | End: {task.end_date ? new Date(task.end_date).toLocaleDateString() : 'N/A'}</span>
              </div>
              <button
                onClick={() => handleDelete(task.id)} // Call handleDelete on button click
                className="ml-4 p-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available.</p> // Message when no tasks are available
      )}
    </div>
  );
};

export default TaskList; // Export the TaskList component
