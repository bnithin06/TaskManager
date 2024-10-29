"use client";
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa'; // Calendar icon
import Link from 'next/link';

const TaskForm = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [recurrence, setRecurrence] = useState({
    frequency: 'Daily',
    interval: 1,
    daysOfWeek: [],
  });
  const [statusMessage, setStatusMessage] = useState(''); // State for status message

  const handleRecurrenceChange = (e) => {
    setRecurrence({
      ...recurrence,
      [e.target.name]: e.target.value,
    });
  };

  const handleDaySelection = (e) => {
    const { value, checked } = e.target;
    let updatedDays = [...recurrence.daysOfWeek];

    if (checked) {
      updatedDays.push(value);
    } else {
      updatedDays = updatedDays.filter((day) => day !== value);
    }

    setRecurrence({
      ...recurrence,
      daysOfWeek: updatedDays,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      title,
      description,
      start_date: startDate ? startDate.toISOString().split('T')[0] : null,
      end_date: endDate ? endDate.toISOString().split('T')[0] : null,
      recurrence_type: recurrence.frequency,
      recurrence_interval: recurrence.interval,
      days_of_week: recurrence.daysOfWeek,
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Task created successfully:', result);
      setStatusMessage('Task added successfully!'); // Set success message

      // Reset form fields after submission
      setTitle('');
      setDescription('');
      setStartDate(null);
      setEndDate(null);
      setRecurrence({ frequency: 'Daily', interval: 1, daysOfWeek: [] });
    } catch (error) {
      console.error('Error creating task:', error);
      setStatusMessage('Failed to add task. Please try again.'); // Set error message
    }
  };

  return (
    <div className="flex justify-center items-center p-3">
      <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-lg bg-slate-200 w-1/2">
        {/* Status Message */}
        {statusMessage && (
          <div className="mt-4 text-center text-green-500 font-bold">
            {statusMessage}
          </div>
        )}

        <div className='flex'>
        <div className="flex justify-between w-full">
          <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        </div>
        <div>
          <Link href={'/'} className=' text-4xl text-slate-700'>✖</Link>
        </div>
        </div>

        {/* Title Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
          />
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Start Date:</label>
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select Start Date"
              className="w-full pl-10 p-2 border border-gray-300 rounded-md"
              required
            />
            <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
              <FaCalendarAlt />
            </div>
          </div>
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">End Date (Optional):</label>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              isClearable
              placeholderText="Select End Date"
              className="w-full pl-10 p-2 border border-gray-300 rounded-md"
            />
            <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
              <FaCalendarAlt />
            </div>
          </div>
        </div>

        {/* Recurrence Frequency */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Recurrence Frequency:</label>
          <select
            name="frequency"
            value={recurrence.frequency}
            onChange={handleRecurrenceChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        {/* Recurrence Interval */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Every:</label>
          <input
            type="number"
            name="interval"
            value={recurrence.interval}
            onChange={handleRecurrenceChange}
            min="1"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <span> {recurrence.frequency.toLowerCase()}</span>
        </div>

        {/* Weekly Recurrence: Specific Days of the Week */}
        {recurrence.frequency === 'Weekly' && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Select Days of the Week:</label>
            <div className="flex flex-wrap mt-3">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <div key={day} className="mr-3">
                  <input
                    type="checkbox"
                    value={day}
                    checked={recurrence.daysOfWeek.includes(day)}
                    onChange={handleDaySelection}
                    className="mr-2"
                  />
                  <label>{day}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
