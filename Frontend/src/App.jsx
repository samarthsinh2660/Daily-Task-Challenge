import React, { useEffect, useState } from 'react';
import './App.css';

// Get the backend URL from the environment variable (Vite)
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [poolMoney, setPoolMoney] = useState(0);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedUser, setSelectedUser] = useState("Samarth"); // Default selection
  const [winner, setWinner] = useState(null);

  // Fetch tasks from the backend.
  const fetchTasks = () => {
    fetch(`${backendUrl}/api/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  // Fetch pool money.
  const fetchPoolMoney = () => {
    fetch(`${backendUrl}/api/pool`)
      .then(res => res.json())
      .then(data => setPoolMoney(data.poolMoney));
  };

  // Check winner.
  const checkWinner = () => {
    fetch(`${backendUrl}/api/winner`)
      .then(res => res.json())
      .then(data => setWinner(data.winner));
  };

  // Reset winner functionality by clearing tasks.
  const resetWinner = () => {
    fetch(`${backendUrl}/api/resetWinner`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        // Clear tasks and reset winner state.
        setTasks([]);
        setWinner(null);
      });
  };

  useEffect(() => {
    fetchTasks();
    fetchPoolMoney();
  }, []);

  // Add a new task.
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    fetch(`${backendUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTaskTitle, user: selectedUser }),
    })
      .then(res => res.json())
      .then(task => {
        setTasks([...tasks, task]);
        setNewTaskTitle("");
      });
  };

  // Toggle task completion.
  const toggleTask = (task) => {
    fetch(`${backendUrl}/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    })
      .then(res => res.json())
      .then(updatedTask => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      });
  };

  // Delete a task.
  const deleteTask = (taskId) => {
    fetch(`${backendUrl}/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(() => {
        setTasks(tasks.filter(t => t.id !== taskId));
      });
  };

  // Increase pool money.
  const increasePool = () => {
    fetch(`${backendUrl}/api/pool`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change: 10 }),
    })
      .then(res => res.json())
      .then(data => setPoolMoney(data.poolMoney));
  };

  // Decrease pool money.
  const decreasePool = () => {
    fetch(`${backendUrl}/api/pool`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change: -10 }),
    })
      .then(res => res.json())
      .then(data => setPoolMoney(data.poolMoney));
  };

  // Filter tasks by user.
  const samarthTasks = tasks.filter(task => task.user === 'Samarth');
  const krishikaTasks = tasks.filter(task => task.user === 'Krishika');

  return (
    <div className="container">
      <h1>Daily Task Challenge</h1>
      <div className="pool">
        <button onClick={decreasePool} className="prize-btn">–</button>
        <h2>Pool Money: ₹{poolMoney}</h2>
        <button onClick={increasePool} className="prize-btn">+</button>
      </div>
      <div className="new-task">
        <h3>Add New Task</h3>
        <input 
          type="text" 
          placeholder="Task title" 
          value={newTaskTitle} 
          onChange={e => setNewTaskTitle(e.target.value)}
          className="input"
        />
        <div className="user-select">
          <label>
            <input 
              type="radio" 
              name="user" 
              value="Samarth" 
              checked={selectedUser === "Samarth"}
              onChange={e => setSelectedUser(e.target.value)}
            />
            Samarth
          </label>
          <label>
            <input 
              type="radio" 
              name="user" 
              value="Krishika" 
              checked={selectedUser === "Krishika"}
              onChange={e => setSelectedUser(e.target.value)}
            />
            Krishika
          </label>
        </div>
        <button onClick={addTask} className="btn">Add Task</button>
      </div>
      <div className="tasks">
        <h3>Tasks</h3>
        <div className="tasks-container">
          <div className="user-tasks user1">
            <h4>Samarth</h4>
            <ul>
              {samarthTasks.map(task => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <span className="task-text">{task.title}</span>
                  <div className="task-actions">
                    <button onClick={() => toggleTask(task)} className="btn small">
                      {task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="btn small delete">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="user-tasks user2">
            <h4>Krishika</h4>
            <ul>
              {krishikaTasks.map(task => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <span className="task-text">{task.title}</span>
                  <div className="task-actions">
                    <button onClick={() => toggleTask(task)} className="btn small">
                      {task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="btn small delete">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="winner-section">
        <button onClick={checkWinner} className="btn">Check Winner</button>
        <button onClick={resetWinner} className="btn">Reset Winner</button>
        {winner ? (
          <h3 className="winner">Winner: {winner}</h3>
        ) : (
          <h3 className="winner">No winner declared yet.</h3>
        )}
      </div>
    </div>
  );
}

export default App;
