"use client";
import React, { useContext, useState, useEffect } from "react";
import Calendar from "react-calendar"; // Import react-calendar
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import { TaskContext } from "../context/TaskContext"; // Import TaskContext

const DatePreview = () => {
  const { tasks, deleteTask } = useContext(TaskContext); // Fetch tasks and delete function from context
  const [selectedDate, setSelectedDate] = useState(null); // Track selected date
  const [tasksForDay, setTasksForDay] = useState([]); // Store tasks for the selected day
  const [statusMessage, setStatusMessage] = useState(""); // Track status messages

  // Check if a task matches the given date and recurrence pattern
  const doesTaskMatchDate = (task, date) => {
    const taskStart = new Date(task.start_date).setHours(0, 0, 0, 0);
    const currentDate = new Date(date).setHours(0, 0, 0, 0);

    switch (task.recurrence_type) {
      case "Daily":
        return currentDate >= taskStart && withinInterval(task, currentDate);

      case "Weekly":
        return (
          currentDate >= taskStart &&
          task.days_of_week.includes(getDayName(date)) &&
          withinInterval(task, currentDate)
        );

      case "Monthly":
        return (
          new Date(taskStart).getDate() === date.getDate() &&
          withinInterval(task, currentDate)
        );

      case "Yearly":
        return (
          new Date(taskStart).getDate() === date.getDate() &&
          new Date(taskStart).getMonth() === date.getMonth() &&
          withinInterval(task, currentDate)
        );

      default:
        return false;
    }
  };

  // Helper to check if the task recurrence interval matches the date
  const withinInterval = (task, date) => {
    if (!task.recurrence_interval) return true; // No interval means every occurrence matches
    const differenceInDays =
      (date - new Date(task.start_date)) / (1000 * 60 * 60 * 24);
    return differenceInDays % task.recurrence_interval === 0;
  };

  // Get the day name (e.g., "Monday")
  const getDayName = (date) => {
    const daysOfWeek = [
      "Sunday", "Monday", "Tuesday", "Wednesday", 
      "Thursday", "Friday", "Saturday"
    ];
    return daysOfWeek[date.getDay()];
  };

  // Handle date selection to display tasks for the selected date
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const filteredTasks = tasks.filter((task) => doesTaskMatchDate(task, date));
    setTasksForDay(filteredTasks);
  };

  // Handle task deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete task");
      }

      setStatusMessage("Task deleted successfully!");
      setTasksForDay((prev) => prev.filter((task) => task.id !== id));

      setTimeout(() => setStatusMessage(""), 3000); // Reset message after 3 seconds
    } catch (error) {
      console.error("Error deleting task:", error);
      setStatusMessage(`Error deleting task: ${error.message}`);
    }
  };

  // Highlight dates with tasks
  const tileClassName = ({ date }) => {
    const formattedDate = new Date(date).setHours(0, 0, 0, 0);
    return tasks.some((task) => {
      const taskDate = new Date(task.start_date).setHours(0, 0, 0, 0);
      return taskDate === formattedDate;
    })
      ? "bg-slate-800 text-white rounded-lg"
      : " bg-black-500"; // Use empty string instead of null
  };
  
  return (
    <div className="bg-slate-200 rounded-lg p-7">
      <h2 className="font-semibold mb-2 text-2xl">Visual Preview:</h2>
      <p className="mb-4">Selected recurring dates displayed on the calendar:</p>

      <div className="flex justify-center">
        <Calendar
          onChange={handleDateChange} // Trigger when a date is selected
          tileClassName={tileClassName} 
        />
      </div>

      {statusMessage && (
        <div className="mt-4 p-2 bg-green-200 text-green-800 rounded">
          {statusMessage}
        </div>
      )}

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">
            Tasks for {selectedDate.toLocaleDateString()}:
          </h3>

          {tasksForDay.length > 0 ? (
            <ul className="list-disc pl-5">
              {tasksForDay.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center mb-2"
                >
                  <div>
                    <strong>{task.title}</strong>
                    <br />
                    <span>{task.description}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="ml-4 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks for this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePreview;
