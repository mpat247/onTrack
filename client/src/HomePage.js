import React, { useState, useEffect } from 'react';
import axios from 'axios';
import onTrackLogo from './onTrackLogo.png';
import './homepage.css';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [newTask, setNewTask] = useState({
    task: '',
    description: '',
    progress: '',
    createDate: '',
    endDate: '',
    priority: ''
  });
  const userData = localStorage.getItem('storageName');
  const userID = localStorage.getItem('storage2');

  const [editTaskData, setEditTaskData] = useState(null);
const [showEditTaskPopup, setShowEditTaskPopup] = useState(false);
const [editData, setEditData] = useState({
  task: '',
  description: '',
  enddate: '',
  progress: '',
  priority: '',
});
const [taskId, setTaskId] = useState(null);


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/tasks/users/${userID}`);
      if (response.status === 200) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    const taskData = {
      task: newTask.task,
      description: newTask.description,
      userId: userID,
      progress: newTask.progress,
      createDate: newTask.createDate,
      endDate: newTask.endDate,
      priority: newTask.priority
    };

    try {
      const response = await axios.post(`http://localhost:5001/tasks`, taskData);
      if (response.status === 200) {
        console.log('Task created successfully');
        fetchTasks();
        setShowTaskPopup(false);
        setNewTask({
          task: '',
          description: '',
          progress: '',
          createDate: '',
          endDate: '',
          priority: ''
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  function goToCalendar() {
    window.location = 'http://localhost:3000/calendarPage';
  }

  const renderTaskPopup = () => {
    if (!showTaskPopup) return null;

    return (
      <div className="task-popup-overlay">
        <div className="task-popup">
          <div className="task-card">
            <h2>Create New Task</h2>
            <div className="task-inputs">
              <input
                type="text"
                placeholder="Task Name"
                value={newTask.task}
                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
              <input
                type="date"
                placeholder="Create Date"
                value={newTask.createDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, createDate: e.target.value })
                }
              />
              <input
                type="date"
                placeholder="End Date"
                value={newTask.endDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, endDate: e.target.value })
                }
              />
              <select
                value={newTask.progress}
                onChange={(e) =>
                  setNewTask({ ...newTask, progress: e.target.value })
                }
              >
                <option value="">Select Your Progress</option> {/* Added default option */}
                <option value="0">To-do</option>
                <option value="1">In Progress</option>
                <option value="2">Done</option>
              </select>

              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
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
      </div>
    );
  };

  function openEditTaskPopup(task) {
    console.log(task.taskId);
    setEditTaskData(task);
    setTaskId(task.taskId);
    setShowEditTaskPopup(true);
  }
  
  async function saveEditedTask(editTaskData) {
    try {
      editTaskData.taskId = taskId;
      console.log(editTaskData.taskId);
      console.log(editTaskData);
  
      // Fetch the original task data for comparison
      const originalTaskResponse = await axios.get(`http://localhost:5001/tasks/tasks/${taskId}`);
      console.log(originalTaskResponse);
  
      if (originalTaskResponse.status === 200) {
        const originalTask = originalTaskResponse.data.payload;
        console.log(originalTask);
        console.log(originalTask.taskname);
  
        // Create an object to hold the final edited data
        const finalEditData = {
          task: editTaskData.task !== '' ? editTaskData.task : originalTask.taskname,
          description: editTaskData.description !== '' ? editTaskData.description : originalTask.description,
          enddate: editTaskData.enddate !== '' ? editTaskData.enddate : originalTask.enddate,
          progress: editTaskData.progress !== '' ? editTaskData.progress : originalTask.progress,
          priority: editTaskData.priority !== '' ? editTaskData.priority : originalTask.priority,
          id: editTaskData.taskId,
        };
  
        console.log(finalEditData);
  
        // Now, finalEditData contains the merged data with non-empty values from
        // editTaskData and originalTask where necessary
  
        const response = await axios.put(`http://localhost:5001/tasks`, finalEditData);
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

  const handleDeleteTask = async () => {
    if (editTaskData && editTaskData.taskId) {
      try {
        const response = await axios.delete(`http://localhost:5001/tasks/${editTaskData.taskId}`);
        if (response.status === 200) {
          // Task deleted successfully
          fetchTasks(); // Refresh the task list
          setShowEditTaskPopup(false); // Close the edit task popup
        } else {
          console.error('Error deleting task:', response.data.message);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };
  
  

  function handleSignOut() {
    // Your sign-out logic here
    localStorage.clear(); // Example: Clearing localStorage
    window.location.href = 'http://localhost:3000/onTrack'; // Redirect after sign out
  }

  const calculateDaysLeft = (endDate) => {
    const endDateTime = new Date(endDate).getTime();
    const currentDate = new Date().getTime();
    const timeLeft = endDateTime - currentDate;
    const daysLeft = Math.floor(timeLeft / (1000 * 3600 * 24)); // Calculate days left
  
    if (daysLeft < 0) {
      return `${Math.abs(daysLeft)} days late`;
    } else if (daysLeft === 0) {
      return "Today";
    } else {
      return `${daysLeft} days left`;
    }
  };
  
  

  return (
    <div className="homepage">
      <header>
        <div className="wave-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#79addc"
              fillOpacity="1"
              d="M0,320L60,304C120,288,240,256,360,229.3C480,203,600,181,720,176C840,171,960,181,1080,181.3C1200,181,1320,171,1380,165.3L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            ></path>
          </svg>
        </div>
        <div id="logo-container">
          <img src={onTrackLogo} id="logo" alt="Logo" />
          <div id="title">onTrack</div>
        </div>
      </header>

      <div className="input-container">
        <div className="form-container">
          <div className="input-group">
            <h1>Welcome {userData}</h1>
          </div>
          <div className="input-group">
            <h2>Your Tasks: </h2>
          </div>
          <div className="tasks-list">
          {tasks.map((task, index) => (
  <div key={index} className="task-item clickable" onClick={() => openEditTaskPopup(task)}>
    <p className="task-name">
      <strong>{task.taskname}</strong>
    </p>
    <p className="due-date">
      Due Date: {task.enddate ? task.enddate.split('T')[0] : 'N/A'}
    </p>
    <p className="days-left">
      {calculateDaysLeft(task.enddate)}
    </p>
  </div>
))}

            <div className="add-task-form">
              <div className="button-container">
                <button className="calendar-button" onClick={goToCalendar}>
                  Go to Calendar
                </button>
                <button
                  className="add-task-button"
                  onClick={() => setShowTaskPopup(true)}
                >
                  Add Task
                </button>
                <button className="logout-button" onClick={handleSignOut}>
                  Log Out
                </button>
              </div>
            </div>
          </div>
          {renderTaskPopup()}
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
          <button onClick={handleDeleteTask}>Delete</button> {/* Add delete button */}
          <button onClick={() => setShowEditTaskPopup(false)}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}
        </div>
      </div>
      <div className="bottom-whitespace"></div> {/* This is for adding whitespace at the bottom */}
    </div>
  );
}

export default HomePage;

