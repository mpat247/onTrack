import React, { useState, useEffect } from 'react';
import axios from 'axios';
import onTrackLogo from './onTrackLogo.png';

import './calendarPage.css';
import 'font-awesome/css/font-awesome.min.css';

const api = "http://localhost:5001";

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
  const userDataString = localStorage.getItem('storageName');
  const userID = localStorage.getItem('storage2'); // Hardcoded for testing
  const [newTask, setNewTask] = useState({ 
    task: '',
    description: '',
    userId: '', 
    progress: '', 
    createDate: '', 
    endDate: '',
    priority: '' 
  });

  useEffect(() => {

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
      const response = await axios.get(`http://localhost:5001/tasks/${userID}`);
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
    if (!showTaskPopup) return null;
  
    const handleCreateTask = async (e) => {
      e.preventDefault();
      const userID = localStorage.getItem('storage2'); // Retrieve userID
    
      // Construct taskData with only the required properties
      const taskData = { 
        task: newTask.task,
        description: newTask.description,
        userId: userID, // Set userId from the retrieved userID
        progress: newTask.progress,
        createDate: newTask.createDate,
        endDate: newTask.endDate,
        priority: newTask.priority 
      };
    
      console.log(taskData)

      try {
        const response = await axios.post(`http://localhost:5001/tasks`, taskData);
        if (response.status === 200) {
          console.log("Task created successfully");
          fetchTasks(userID); // Re-fetch tasks to update list
          setShowTaskPopup(false); // Close the popup
        }
      } catch (error) {
        console.error('Error creating task:', error);
      }
    };
  
    return (
      <div className="task-popup">
        <div className="task-card">
          <h2>Create New Task</h2>
          <div className="task-inputs">
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
            <select
              value={newTask.progress}
              onChange={e => setNewTask({ ...newTask, progress: e.target.value })}
            >
              <option value="">Select Your Progress</option> {/* Added default option */}
              <option value="0">To-do</option>
              <option value="1">In Progress</option>
              <option value="2">Done</option>
            </select>

            <select
  value={newTask.priority}
  onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
>
  <option value="">Select Priority</option> {/* Added default option */}
  <option value="0">Low</option>
  <option value="1">Medium</option>
  <option value="2">High</option>
</select>

          </div>
          <div className="task-actions">
            <button onClick={handleCreateTask}>Create Task</button>
            <button onClick={() => setShowTaskPopup(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
  
  
  return (
    <body>

      <title>Calendar</title>
      
      <header>
                <div className="wave-header">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#79addc" fillOpacity="1" d="M0,320L60,304C120,288,240,256,360,229.3C480,203,600,181,720,176C840,171,960,181,1080,181.3C1200,181,1320,171,1380,165.3L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
                    </svg>
                </div>
                <div id="logo-container"> 
                  <img src={onTrackLogo} id="logo" alt="Logo" />
                  <button className="view-mode-button" onClick={() => setViewMode('calendar')}>Calendar View</button>
                  <button className="view-mode-button" onClick={() => setViewMode('list')}>List View</button>

                </div>
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

