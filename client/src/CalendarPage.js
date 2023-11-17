import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './calendarPage.css';
import 'font-awesome/css/font-awesome.min.css';

const api = "http://localhost:5004";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const progress =["To-do", "Doing", "Done"];
const progressColors = ["todo", "doing", "done"];

function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState('');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [newTask, setNewTask] = useState({
    task: '',
    description: '',
    createDate: '',
    endDate: '',
    priority: '',
    progress: ''
  });

  useEffect(() => {
    const userDataString = localStorage.getItem('storageName');
    const userID = localStorage.getItem('storage2'); // Hardcoded for testing

    if (userDataString) {
      setUserName(userDataString); // Assuming this is just a string, not an object
    }

    if (userID) {
      fetchTasks(userID);
    }
  }, []);
 
  useEffect(() => {
    // Initial render of the calendar
    const date = new Date();
    renderCalendar(date.getMonth(), date.getFullYear());
  }, [tasks]);

  async function fetchTasks(userID) {
    try {
      const response = await axios.get(`http://localhost:5004/tasks/${userID}`);
      if (response.status === 200) {
        const updatedTasks = response.data.data.map(task => ({
          ...task,
          displayDate: task.enddate.split('T')[0] // Extracting the date part
        }));
        setTasks(updatedTasks);
  
        // Call renderCalendar after state update
        const date = new Date();
        renderCalendar(date.getMonth(), date.getFullYear());
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }
  
  // Function to handle form submission
  const handleCreateTask = async () => {
    try {
      const userID = localStorage.getItem('storage2'); // Retrieve userID
      const taskData = { ...newTask, userid: userID };
      const response = await axios.post(`http://localhost:5004/tasks/create`, taskData);

      if (response.status === 200) {
        // Handle successful task creation
        console.log("Task created successfully");
        fetchTasks(userID); // Re-fetch tasks to update list
        setShowTaskPopup(false); // Close the popup
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  function renderCalendar(currentMonth, currentYear) {
    if (viewMode !== 'calendar') return;

    const daysContainer = document.querySelector(".days");
    const monthLabel = document.querySelector(".month");

    monthLabel.innerHTML = `${months[currentMonth]} ${currentYear}`;

    let days = "";
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const lastDayIndex = new Date(currentYear, currentMonth + 1, 0).getDay();
    const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    const nextDays = 7 - lastDayIndex - 1;

    for (let x = firstDayIndex; x > 0; x--) {
      days += `<div class="day prev">${prevLastDay - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDay; i++) {
      const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const tasksForDay = tasks.filter(task => task.displayDate === fullDate);

      let taskHTML = tasksForDay.map(task => {
        // Assuming 'progress' field in task is a numeric value corresponding to the indices of the 'progress' array
        const progressIndex = task.progress;
        const progressText = progress[progressIndex]; // Access the corresponding progress text
    
        return `
            <div class="task-card">
                <div class="task-details">
                    <span class="task-name"><strong>${task.taskname}</strong></span>
                    <span class="task-progress">
                        <span class="progress-pill ${progressColors[progressIndex]}"></span>
                        <em>${progressText}</em> <!-- Display the progress as text -->
                    </span>
                </div>
            </div>`;
    }).join('');
    
    
      if (i === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
        days += `<div class="day today">${i}${taskHTML}</div>`;
      } else {
        days += `<div class="day">${i}${taskHTML}</div>`;
      }
    }

    for (let j = 1; j <= nextDays; j++) {
      days += `<div class="day next">${j}</div>`;
    }

    daysContainer.innerHTML = days;
  }

  useEffect(() => {
    const date = new Date();
    renderCalendar(date.getMonth(), date.getFullYear());
  }, [viewMode, tasks]);

  useEffect(() => {
    const date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    renderCalendar(currentMonth, currentYear);

    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const todayBtn = document.querySelector(".today-btn");

    nextBtn.addEventListener("click", () => {
      currentMonth = (currentMonth + 1) % 12;
      currentYear = (currentMonth === 0) ? currentYear + 1 : currentYear;
      renderCalendar(currentMonth, currentYear);
    });

    prevBtn.addEventListener("click", () => {
      currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
      currentYear = (currentMonth === 11) ? currentYear - 1 : currentYear;
      renderCalendar(currentMonth, currentYear);
    });

    todayBtn.addEventListener("click", () => {
      currentMonth = new Date().getMonth();
      currentYear = new Date().getFullYear();
      renderCalendar(currentMonth, currentYear);
    });
  }, []);

  function handleSignOut() {
    // Your sign-out logic here
    localStorage.clear(); // Example: Clearing localStorage
    window.location.href = 'http://localhost:3000/onTrack'; // Redirect after sign out
  }

  function renderListView() {
    return (
      <div className="task-list">
        <h2>Your Tasks:</h2>
        {tasks.map(task => (
          <div className="task-item" key={task.taskId}>
            <label htmlFor={`task-${task.taskId}`}>
              <input type="checkbox" id={`task-${task.taskId}`} />
              <strong>{task.taskname}</strong>
              <p>End Date: {task.enddate.split('T')[0]}</p>
              <p>Status: {progress[task.progress]}</p>
            </label>
          </div>
        ))}
      </div>
    );
  }
  
  function renderTaskPopup() {
    return showTaskPopup && (
      <div className="task-popup">
        <div className="task-form">
          <h2>Create New Task</h2>
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.task}
            onChange={e => setNewTask({ ...newTask, task: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          />
          <input
            type="date"
            placeholder="Create Date"
            value={newTask.createDate}
            onChange={e => setNewTask({ ...newTask, createDate: e.target.value })}
          />
          <input
            type="date"
            placeholder="End Date"
            value={newTask.endDate}
            onChange={e => setNewTask({ ...newTask, endDate: e.target.value })}
          />
          <input
            type="number"
            placeholder="Priority"
            value={newTask.priority}
            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
          />
          <select
            value={newTask.progress}
            onChange={e => setNewTask({ ...newTask, progress: e.target.value })}
          >
            <option value="To-do">To-do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </select>
          <button onClick={handleCreateTask}>Create Task</button>
          <button onClick={() => setShowTaskPopup(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <body>

      <title>Calendar</title>
      <header>
        <ul>
          <li><button className="view-mode-button" onClick={() => setViewMode('calendar')}>Calendar View</button></li>
          <li><button className="view-mode-button" onClick={() => setViewMode('list')}>List View</button></li>
        </ul>
      </header>
      <div className="buttons">
      <button onClick={() => setShowTaskPopup(true)}>Create New Task</button>

        <button onClick={handleSignOut}>
          Logout
        </button>

      </div>
      <div className='input-group'>
        <h1>Welcome {userName}</h1>
      </div>
      <div className="container">
        {viewMode === 'calendar' ? (
          <div className="calendar">
            <div className="header">
              <div className="month">November, 2023</div>
              <div className="btns">
                <div className="btn today-btn">
                  <i className="fas fa-calendar-day"></i>
                </div>
                <div className="btn prev-btn">
                  <i className="fas fa-chevron-left"></i>
                </div>
                <div className="btn next-btn">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
            <div className="weekdays">
              <div className="day">Sun</div>
              <div className="day">Mon</div>
              <div className="day">Tue</div>
              <div className="day">Wed</div>
              <div className="day">Thu</div>
              <div className="day">Fri</div>
              <div className="day">Sat</div>
            </div>
            <div class="days">
            </div>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map(task => (
              <div className="task-item" key={task.taskId}>
                <h3>{task.taskname}</h3>
                <p>Description: {task.description}</p>
                <p>End Date: {task.enddate.split('T')[0]}</p>
                <p>Status: {progress[task.progress]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {renderTaskPopup()}
    </body>
  );
}

export default CalendarPage;
