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
const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
const [deleteConfirmationTaskId, setDeleteConfirmationTaskId] = useState(false);
const [currentTaskId, setCurrentTaskId] = useState(null);


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
  
    // Check if any of the required fields are empty
    if (!newTask.task || !newTask.description || !newTask.createDate || !newTask.endDate || newTask.progress === '' || newTask.priority === '') {
      alert('Please fill in all required fields.'); // Display an alert message
      return; // Exit the function without creating the task
    }
  
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
    console.log('Render task popup called'); // Add this line for debugging
  
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
  <option value="0" style={{ color: '#ff5733' }}>To-do</option> {/* Red for 'To-do' */}
  <option value="1" style={{ color: '#ffac33' }}>In Progress</option> {/* Orange for 'In Progress' */}
  <option value="2" style={{ color: 'green' }}>Done</option> {/* Green for 'Done' */}
</select>

<select
  value={newTask.priority}
  onChange={(e) =>
    setNewTask({ ...newTask, priority: e.target.value })
  }
>
  <option value="">Select Priority</option> {/* Added default option */}
  <option value="0" style={{ color: 'blue' }}>Low</option> {/* Blue for 'Low' */}
  <option value="1" style={{ color: 'purple' }}>Medium</option> {/* Purple for 'Medium' */}
  <option value="2" style={{ color: 'red' }}>High</option> {/* Red for 'High' */}
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
    setEditTaskData(task);
    setTaskId(task.taskId);
    setCurrentTaskId(task.taskId);
    setShowEditTaskPopup(true);
  }
  
  async function saveEditedTask(editTaskData) {
    try {
      editTaskData.taskId = taskId;
  
  
      // Fetch the original task data for comparison
      const originalTaskResponse = await axios.get(`http://localhost:5001/tasks/tasks/${taskId}`);
  
      if (originalTaskResponse.status === 200) {
        const originalTask = originalTaskResponse.data.payload;

  
        // Create an object to hold the final edited data
        const finalEditData = {
          task: editTaskData.task !== '' ? editTaskData.task : originalTask.taskname,
          description: editTaskData.description !== '' ? editTaskData.description : originalTask.description,
          enddate: editTaskData.enddate !== '' ? editTaskData.enddate : originalTask.enddate,
          progress: editTaskData.progress !== '' ? editTaskData.progress : originalTask.progress,
          priority: editTaskData.priority !== '' ? editTaskData.priority : originalTask.priority,
          id: editTaskData.taskId,
        };
  
  
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

  const handleDeleteTask = async (task) => {
    console.log('Delete button clicked'); // Add this line for debugging
    // Set the task ID for which the delete confirmation should be displayed
    setDeleteConfirmationTaskId(task.taskId);
    setCurrentTaskId(taskId);
    setShowDeleteConfirmation(true); // Show the delete confirmation dialog
    setShowEditTaskPopup(false);
  };

  async function confirmDeleteTask() {
    try {
      console.log(taskId)
      const response = await axios.delete(
        `http://localhost:5001/tasks/${taskId}`
      );
      if (response.status === 200) {
        // Task deleted successfully
        console.log('confirmDeleteTask: Task deleted successfully.');
        fetchTasks(); // Refresh the task list
        setShowEditTaskPopup(false); // Close the edit task popup
        setShowDeleteConfirmation(false); // Close the delete confirmation dialog
      } else {
        console.error('confirmDeleteTask: Error deleting task:', response.data.message);
      }
    } catch (error) {
      console.error('confirmDeleteTask: Error deleting task:', error);
    }
  }
  

  const cancelDeleteTask = () => {
    // Reset the current taskID and close the delete confirmation dialog
    setCurrentTaskId(null);
    setShowDeleteConfirmation(false);
    console.log('cancelDeleteTask: Delete operation canceled.');
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

  function sortByDueDate(tasks) {
    // Use the JavaScript sort function to sort the tasks by enddate
    return tasks.sort((a, b) => {
      // Convert the enddate strings to Date objects for comparison
      const dateA = new Date(a.enddate);
      const dateB = new Date(b.enddate);
  
      // Compare the dates
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return 0;
    });
  }
  
  
  

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
          {sortByDueDate(tasks).map((task, index) => (
  <div key={index} className="task-item clickable" onClick={() => openEditTaskPopup(task)}>
  <div className="task-details-left">
    <div className="task-name-due-date">
      <p className="task-name">
        <strong>{task.taskname}</strong>
      </p>
      <p className="due-date">
        Due Date: {task.enddate ? task.enddate.split('T')[0] : 'N/A'}
      </p>
    </div>
    <p className="days-left">
      {calculateDaysLeft(task.enddate)}
    </p>
    <div className="task-description">
    <h5 style={{ paddingTop: '10px', fontSize: '18px' }}><strong>Description:</strong></h5>
      <p className="due-description">
        {task.description}
      </p>
    </div>
  </div>
  <div className="task-details-right">
    {/* Display progress with corresponding text and color */}
    <p className="task-progress" style={{ color: task.progress === '0' || task.progress === 0 ? '#ff0000 ' : task.progress === '1' || task.progress === 1 ? '#ff7933 ' : task.progress === '2' || task.progress === 2 ? 'green' : 'inherit' }}>
      {task.progress === '0' || task.progress === 0 ? 'To-do' : task.progress === '1' || task.progress === 1 ? 'In Progress' : task.progress === '2' || task.progress === 2 ? 'Done' : ''}
    </p>
    {/* Display priority with corresponding text and color */}
    <p className="task-priority" style={{ color: task.priority === '0' || task.priority === 0 ? '#2a9df4' : task.priority === '1' || task.priority === 1 ? '#1167b1' : task.priority === '2' || task.priority === 2 ? '#03254c' : 'inherit' }}>
      {task.priority === '0' || task.priority === 0 ? 'Low' : task.priority === '1' || task.priority === 1 ? 'Medium' : task.priority === '2' || task.priority === 2 ? 'High' : ''}
    </p>
  </div>
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
          <button onClick={() => setShowEditTaskPopup(false)}>Cancel</button>
          <button onClick={handleDeleteTask}>Delete</button> {/* Add delete button */}
        </div>
        

      </form>
    </div>
  </div>
)}
{/* Confirmation dialog for deleting a task */}
{showDeleteConfirmation && (
  <div className="delete-confirmation">
    <p>Are you sure you want to delete this task?</p>
    <button onClick={confirmDeleteTask}>Yes</button>
    <button onClick={cancelDeleteTask}>No</button>
  </div>
)}

        </div>
      </div>
      <div className="bottom-whitespace"></div> {/* This is for adding whitespace at the bottom */}
    </div>

    
  );
}

export default HomePage;

