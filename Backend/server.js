require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

// Read frontend URL from .env file.
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
}));

app.use(express.json());

// In-memory storage for tasks and mutable pool money value.
let tasks = [];
let poolMoney = 1000; // Starting pool money

// Utility: Purge tasks that are older than 24 hours.
function purgeExpiredTasks() {
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  tasks = tasks.filter(task => now - task.createdAt < twentyFourHours);
}

// GET all tasks (only tasks less than 24 hours old)
app.get('/api/tasks', (req, res) => {
  purgeExpiredTasks();
  res.json(tasks);
});

// POST a new task. Expects JSON: { title: string, user: string }
app.post('/api/tasks', (req, res) => {
  purgeExpiredTasks();
  const { title, user } = req.body;
  if (!title || !user) {
    return res.status(400).json({ error: 'Title and user are required' });
  }
  const newTask = {
    id: tasks.length + 1,
    title,
    user, 
    completed: false,
    createdAt: Date.now(),  // Timestamp for the task creation.
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update a task (e.g., toggle completion or update title).
app.put('/api/tasks/:id', (req, res) => {
  purgeExpiredTasks();
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  res.json(tasks[taskIndex]);
});

// DELETE a task.
app.delete('/api/tasks/:id', (req, res) => {
  purgeExpiredTasks();
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const removedTask = tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted', task: removedTask[0] });
});

// GET the current pool money value.
app.get('/api/pool', (req, res) => {
  res.json({ poolMoney });
});

// PUT endpoint to update the pool money value.
// Expects JSON: { change: number } where the change can be positive or negative.
app.put('/api/pool', (req, res) => {
  const { change } = req.body;
  if (typeof change !== 'number') {
    return res.status(400).json({ error: 'Invalid change value' });
  }
  poolMoney += change;
  res.json({ poolMoney });
});

// GET winner endpoint.
// Winner logic (only tasks within last 24 hrs):
// A user is declared winner if they have completed >=50% of their tasks and the other user has completed 0 tasks.
// Additionally, if one user has no tasks, the other is declared winner (if they have any tasks).
app.get('/api/winner', (req, res) => {
  purgeExpiredTasks();
  
  // Use user names as "Samarth" and "Krishika"
  const samarthTasks = tasks.filter(task => task.user === 'Samarth');
  const krishikaTasks = tasks.filter(task => task.user === 'Krishika');
  
  const completedSamarth = samarthTasks.filter(task => task.completed).length;
  const completedKrishika = krishikaTasks.filter(task => task.completed).length;
  
  let winner = null;
  
  if (samarthTasks.length === 0 && krishikaTasks.length > 0) {
    // If Samarth has no tasks, Krishika wins automatically (if she has any tasks)
    winner = 'Krishika';
  } else if (krishikaTasks.length === 0 && samarthTasks.length > 0) {
    // If Krishika has no tasks, Samarth wins automatically (if he has any tasks)
    winner = 'Samarth';
  } else {
    if (samarthTasks.length > 0 && (completedSamarth / samarthTasks.length >= 0.5) && completedKrishika === 0) {
      winner = 'Samarth';
    } else if (krishikaTasks.length > 0 && (completedKrishika / krishikaTasks.length >= 0.5) && completedSamarth === 0) {
      winner = 'Krishika';
    }
  }
  
  res.json({
    winner,
    samarth: { total: samarthTasks.length, completed: completedSamarth },
    krishika: { total: krishikaTasks.length, completed: completedKrishika }
  });
});

// POST endpoint to reset winner functionality by clearing tasks.
app.post('/api/resetWinner', (req, res) => {
  tasks = [];
  res.json({ message: 'Winner functionality reset. All tasks have been cleared.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
