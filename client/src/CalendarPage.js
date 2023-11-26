import React, { useState, useEffect } from 'react';
import axios from 'axios';
import onTrackLogo from './onTrackLogo.png';
import './calendarPage.css';
import 'font-awesome/css/font-awesome.min.css';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Link } from 'react-router-dom';


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
  const [showStatisticsPopup, setShowStatisticsPopup] = useState(false);
  const userDataString = localStorage.getItem('storageName');
  const userID = localStorage.getItem('storage2'); // Hardcoded for testing
  const [editTaskData, setEditTaskData] = useState(null);
  const [showEditTaskPopup, setShowEditTaskPopup] = useState(false);
  const [editData, setEditData] = useState({
    task: '', // Initialize with default values if needed
    description: '',
    enddate: '',
    progress: '',
    priority: '',
  });
    const [taskId, setTaskId] = useState(null);

  const [newTask, setNewTask] = useState({ 
    task: '',
    description: '',
    userId: '', 
    progress: '', 
    createDate: '', 
    endDate: '',
    priority: '' 
  });

  const [showPopUpCard, setShowPopUpCard] = useState(false);
  const [selectedTasksForDay, setSelectedTasksForDay] = useState([]);

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

  const viewAllTasks = (dateToShowTasks) => {
    const tasksToShow = tasks.filter(task => task.displayDate === dateToShowTasks);
    setSelectedTasksForDay(tasksToShow);
    setShowPopUpCard(true);
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
  
      let taskHTML = "";
  
      if (tasksForDay.length === 1) {
        const task = tasksForDay[0];
        const progressIndex = task.progress;
        const progressText = progress[progressIndex];
  
        // Create a task card div with an "editable" data attribute
        taskHTML = `
           <div class="task-card">
    <div class="task-details">
      <span className="task-name"><strong>${task.taskname}</strong></span>
      <span class="task-progress">
        <span class="progress-pill ${progressColors[progressIndex]}"></span>
        <em>${progressText}</em>
      </span>
    </div>
  </div>`;
      } else if (tasksForDay.length > 1) {
        taskHTML = `
          <div class="task-card">
            <div class="task-details">
              <button class="show-tasks-button" data-date="${fullDate}">View All</button>
            </div>
          </div>`;
      }
  
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
  
    
  
    // Add event listeners to the "View All" buttons
    const viewAllButtons = document.querySelectorAll(".show-tasks-button");
    viewAllButtons.forEach(button => {
      button.addEventListener("click", () => {
        const dateToShowTasks = button.getAttribute("data-date");
        const tasksToShow = tasks.filter(task => task.displayDate === dateToShowTasks);
        setSelectedTasksForDay(tasksToShow);
        setShowPopUpCard(true);
      });
    });
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

  const prepareChartData = (tasks) => {
    const progressCounts = { todo: 0, doing: 0, done: 0 };
    const priorityCounts = { low: 0, medium: 0, high: 0 };

    tasks.forEach(task => {
      if (task.progress === 0) progressCounts.todo += 1;
      if (task.progress === 1) progressCounts.doing += 1;
      if (task.progress === 2) progressCounts.done += 1;

      if (task.priority === 0) priorityCounts.low += 1;
      if (task.priority === 1) priorityCounts.medium += 1;
      if (task.priority === 2) priorityCounts.high += 1;
    });

    const progressChartData = {
      labels: ['To-do', 'Doing', 'Done'],
      datasets: [{
        data: [progressCounts.todo, progressCounts.doing, progressCounts.done],
        backgroundColor: ['#ff4d4d', '#ffa500', '#4caf50'],
      }]
    };

    const priorityChartData = {
      labels: ['Low', 'Medium', 'High'],
      datasets: [{
        data: [priorityCounts.low, priorityCounts.medium, priorityCounts.high],
        backgroundColor: ['#add8e6', '#dda0dd', '#ffa07a'],
      }]
    };

    return { progressChartData, priorityChartData };
  }

  function renderListView() {
    return (
      <div className="task-list">
        <h2>Your Tasks:</h2>
        {tasks.map(task => (
          <div className="task-item" key={task.taskId}>
            <label htmlFor={`task-${task.taskId}`}>
              <input type="checkbox" id={`task-${task.taskId}`} />
              <a href="#" onClick={() => openEditTaskPopup(task)}>
  <span className="task-name"><strong>{task.taskname}</strong></span>
</a>


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
  
  const PopUpCard = ({ onClose }) => {
    return (
      <div className="popup-card">
        <div className="popup-card-content">
          <button className="popup-close-button" onClick={() => onClose(false)}>
            Close
          </button>
          <h2>Tasks</h2>
          <div className="task-list">
            {selectedTasksForDay.map(task => (
              <div className="task-item" key={task.taskId}>
                {/* Modify the "Edit" link to close the PopUpCard */}
                <a
                  href="#"
                  onClick={() => {
                    openEditTaskPopup(task);
                    onClose(false); // Close the PopUpCard
                  }}
                >
                  <strong>{task.taskname}</strong>
                </a>
                <p>Description: {task.description}</p>
                <p>End Date: {task.enddate.split('T')[0]}</p>
                <p>Status: {progress[task.progress]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  function openEditTaskPopup(task) {
    console.log(task.taskId)
    setEditTaskData(task);
    setTaskId(task.taskId);
    setShowEditTaskPopup(true);
  }

  async function saveEditedTask(editTaskData) {
    try {
      editTaskData.taskId = taskId;
      console.log(editTaskData.taskId)
      console.log(editTaskData)
      // Fetch the original task data for comparison
      const originalTaskResponse = await axios.get(`http://localhost:5001/tasks?taskId=${editTaskData.taskId}`);
      console.log(originalTaskResponse)
      if (originalTaskResponse.status === 200) {
        const originalTask = originalTaskResponse.data.data;
        console.log(originalTask);
        // Remove the createDate property from the edited task data
        const { createDate, ...editedDataWithoutCreateDate } = editTaskData;
        
        // Remove the createDate property from the original task data
        delete originalTask.createDate;
  
        // Merge the edited data with the original data to preserve missing fields
        const updatedTask = { ...originalTask, ...editedDataWithoutCreateDate };
    
        console.log(updatedTask);
    
        const response = await axios.put(`http://localhost:5001/tasks`, updatedTask);
        if (response.status === 200) {
          // Update the tasks after saving
          fetchTasks(userID);
          setShowEditTaskPopup(false); // Close the edit task popup
        }
      } else {
        console.error('Error fetching original task data');
      }
    } catch (error) {
      console.error('Error saving edited task:', error);
    }
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
          <a href="http://localhost:3000/HomePage">
            <img src={onTrackLogo} id="logo" alt="Logo" />
          </a>
          <button className="view-mode-button" onClick={() => setViewMode('calendar')}>Calendar View</button>
          <button className="view-mode-button" onClick={() => setViewMode('list')}>List View</button>
          <Link to="/homepage"><button className="view-mode-button">
    <i className="fas fa-home" style={{ color: 'white' }}></i>
</button></Link>



        </div>
      </header>

      {showStatisticsPopup && (
        <div className="statistics-popup">
          <h2>Task Statistics</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ width: '300px', height: '300px' }}>
              <h3>Task Progress</h3>
              <Pie data={prepareChartData(tasks).progressChartData} />
            </div>
            <div style={{ width: '300px', height: '300px' }}>
              <h3>Task Priority</h3>
              <Pie data={prepareChartData(tasks).priorityChartData} />
            </div>
          </div>
          <button onClick={() => setShowStatisticsPopup(false)}>Close</button>
        </div>
      )}

      <div className="buttons">
        <button onClick={() => setShowTaskPopup(true)}>Create New Task</button>
        <button onClick={() => setShowStatisticsPopup(true)}>View Statistics</button>
        <button onClick={handleSignOut}>Logout</button>
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
            <div className="days">
            </div>
          </div>
          ) : (
            <div className="task-list">
              {tasks.map(task => (
                <div className="task-item" key={task.taskId}>
                  {/* Make the task name clickable */}
                  <a href="#" onClick={() => openEditTaskPopup(task)}>
  <span className="task-name"><strong>{task.taskname}</strong></span>
</a>
                  <p>Description: {task.description}</p>
                  <p>End Date: {task.enddate.split('T')[0]}</p>
                  <p>Status: {progress[task.progress]}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {renderTaskPopup()}

      {showPopUpCard && <PopUpCard onClose={() => setShowPopUpCard(false)} />}
      
      {showEditTaskPopup && editTaskData && (
  <div className="task-popup">
    <div className="task-card">
    <h2 style={{ textAlign: 'center' }}>Edit Task</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveEditedTask(editData);
        }}
      >
        <div className="task-inputs">
        <div className="input-group">
  <label>Task Name</label>
  <input
    type="text"
    placeholder="Task Name"
    value={editData.task === '' ? editTaskData.task : editData.task}
    onChange={(e) =>
      setEditData({
        ...editData,
        task: e.target.value
      })
    }
  />
</div>
<div className="input-group">
  <label>Description</label>
  <textarea
    placeholder="Description"
    value={editData.description === '' ? editTaskData.description : editData.description}
    onChange={(e) =>
      setEditData({
        ...editData,
        description: e.target.value
      })
    }
  />
</div>
<div className="input-group">
  <label>End Date</label>
  <input
    type="date"
    placeholder="End Date"
    value={editData.enddate === '' ? editTaskData.enddate : editData.enddate}
    onChange={(e) =>
      setEditData({
        ...editData,
        enddate: e.target.value
      })
    }
  />
</div>
<div className="input-group">
  <label>Progress</label>
  <select
    value={editData.progress === '' ? editTaskData.progress : editData.progress}
    onChange={(e) =>
      setEditData({
        ...editData,
        progress: e.target.value
      })
    }
  >
    <option value="">Select Your Progress</option>
    <option value="0">To-do</option>
    <option value="1">In Progress</option>
    <option value="2">Done</option>
  </select>
</div>
<div className="input-group">
  <label>Priority</label>
  <select
    value={editData.priority === '' ? editTaskData.priority : editData.priority}
    onChange={(e) =>
      setEditData({
        ...editData,
        priority: e.target.value
      })
    }
  >
    <option value="">Select Priority</option>
    <option value="0">Low</option>
    <option value="1">Medium</option>
    <option value="2">High</option>
  </select>
</div>


        </div>
        <div className="task-actions">
          <button type="submit">Save</button>
          <button onClick={() => setShowEditTaskPopup(false)}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}



    </body>
      );
}

export default CalendarPage;


