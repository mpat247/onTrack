import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  async function fetchTasks(userID) {
    try {
      const response = await axios.get(`http://localhost:5001/tasks/${userID}`);
      if (response.status === 200) {
        setTasks(response.data.data.map(task => ({
          ...task,
          displayDate: task.enddate.split('T')[0] // Extracting the date part
        })));
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  function renderCalendar(currentMonth, currentYear) {
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

  return (
    <body>
      <title>Calendar</title>
      <header>
        <ul>
          <li><a href="/calendarpage">Calendar View</a></li>
          <li><a href="/">List View</a></li>
        </ul>
      </header>
      <div class ="buttons">
  <button onClick={handleSignOut}>
    Logout
  </button>
</div>

      <div className='input-group'>
        <h1>Welcome {userName}</h1>
      </div>
      <div className="container">
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
            {/* Weekdays... */}
          </div>
          <div className="days"> 
            {/* Days will be rendered here */}
          </div>
        </div>
      </div>
    </body>
  );
}

export default CalendarPage;
