const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let tasks = [
  { id: uuidv4(), title: 'Set up project', description: 'Initialize the task manager application', status: 'done', priority: 'high', createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Design database schema', description: 'Plan out the data models for tasks', status: 'in-progress', priority: 'high', createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Build REST API', description: 'Create endpoints for CRUD operations', status: 'in-progress', priority: 'medium', createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Write unit tests', description: 'Cover all API endpoints with tests', status: 'todo', priority: 'medium', createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Deploy to production', description: 'Set up CI/CD and deploy the app', status: 'todo', priority: 'low', createdAt: new Date().toISOString() },
];

app.get('/api/tasks', (req, res) => {
  const { status, priority } = req.query;
  let filtered = [...tasks];
  if (status) filtered = filtered.filter(t => t.status === status);
  if (priority) filtered = filtered.filter(t => t.priority === priority);
  res.json(filtered);
});

app.get('/api/tasks/stats', (req, res) => {
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
  };
  res.json(stats);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.post('/api/tasks', (req, res) => {
  const { title, description, priority = 'medium' } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const task = {
    id: uuidv4(),
    title,
    description: description || '',
    status: 'todo',
    priority,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[idx] = { ...tasks[idx], ...req.body, id: tasks[idx].id, createdAt: tasks[idx].createdAt };
  res.json(tasks[idx]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(idx, 1);
  res.status(204).send();
});

app.listen(PORT, 'localhost', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
