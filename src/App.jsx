import React, { useState, useEffect } from 'react';
import './App.css';

const STATUSES = ['todo', 'in-progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

const statusLabel = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };
const priorityColor = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };
const statusColor = { todo: '#7b7f9e', 'in-progress': '#6c63ff', done: '#22c55e' };

function StatsBar({ stats }) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-num">{stats.total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-card">
        <span className="stat-num" style={{ color: '#7b7f9e' }}>{stats.todo}</span>
        <span className="stat-label">To Do</span>
      </div>
      <div className="stat-card">
        <span className="stat-num" style={{ color: '#6c63ff' }}>{stats.inProgress}</span>
        <span className="stat-label">In Progress</span>
      </div>
      <div className="stat-card">
        <span className="stat-num" style={{ color: '#22c55e' }}>{stats.done}</span>
        <span className="stat-label">Done</span>
      </div>
      <div className="stat-card">
        <span className="stat-num" style={{ color: '#ef4444' }}>{stats.highPriority}</span>
        <span className="stat-label">High Priority</span>
      </div>
    </div>
  );
}

function TaskForm({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onAdd({ title: title.trim(), description: description.trim(), priority });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Task</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} className="task-form">
          <label>Title *</label>
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter task title..."
            required
          />
          <label>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={3}
          />
          <label>Priority</label>
          <div className="priority-select">
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                className={`priority-btn ${priority === p ? 'active' : ''}`}
                style={{ '--p-color': priorityColor[p] }}
                onClick={() => setPriority(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskCard({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const cycleStatus = () => {
    const idx = STATUSES.indexOf(task.status);
    const next = STATUSES[(idx + 1) % STATUSES.length];
    onUpdate(task.id, { status: next });
  };

  const saveEdit = async () => {
    if (!title.trim()) return;
    await onUpdate(task.id, { title: title.trim(), description: description.trim() });
    setEditing(false);
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <span
          className="status-badge"
          style={{ background: statusColor[task.status] + '22', color: statusColor[task.status] }}
          onClick={cycleStatus}
          title="Click to cycle status"
        >
          {statusLabel[task.status]}
        </span>
        <span
          className="priority-dot"
          style={{ background: priorityColor[task.priority] }}
          title={`${task.priority} priority`}
        />
      </div>
      {editing ? (
        <div className="task-edit">
          <input value={title} onChange={e => setTitle(e.target.value)} />
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} />
          <div className="edit-actions">
            <button className="btn-secondary sm" onClick={() => { setEditing(false); setTitle(task.title); setDescription(task.description); }}>Cancel</button>
            <button className="btn-primary sm" onClick={saveEdit}>Save</button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="task-title">{task.title}</h3>
          {task.description && <p className="task-desc">{task.description}</p>}
        </>
      )}
      <div className="task-card-footer">
        <span className="task-date">{new Date(task.createdAt).toLocaleDateString()}</span>
        <div className="task-actions">
          <button className="icon-btn" onClick={() => setEditing(!editing)} title="Edit">✏️</button>
          <button className="icon-btn danger" onClick={() => onDelete(task.id)} title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0, highPriority: 0 });
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const params = new URLSearchParams();
    if (filterStatus !== 'all') params.set('status', filterStatus);
    if (filterPriority !== 'all') params.set('priority', filterPriority);
    const res = await fetch(`/api/tasks?${params}`);
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  };

  const fetchStats = async () => {
    const res = await fetch('/api/tasks/stats');
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filterStatus, filterPriority]);

  const addTask = async (taskData) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (res.ok) {
      fetchTasks();
      fetchStats();
    }
  };

  const updateTask = async (id, updates) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      fetchTasks();
      fetchStats();
    }
  };

  const deleteTask = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchTasks();
      fetchStats();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="app-title">Task Manager</h1>
            <p className="app-subtitle">Keep track of everything that matters</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ New Task</button>
        </div>
      </header>

      <main className="app-main">
        <StatsBar stats={stats} />

        <div className="filters">
          <div className="filter-group">
            <span className="filter-label">Status:</span>
            {['all', ...STATUSES].map(s => (
              <button
                key={s}
                className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s === 'all' ? 'All' : statusLabel[s]}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <span className="filter-label">Priority:</span>
            {['all', ...PRIORITIES].map(p => (
              <button
                key={p}
                className={`filter-btn ${filterPriority === p ? 'active' : ''}`}
                onClick={() => setFilterPriority(p)}
              >
                {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No tasks found. Add one to get started!</p>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && <TaskForm onAdd={addTask} onClose={() => setShowForm(false)} />}
    </div>
  );
}
