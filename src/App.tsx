import React, { useState } from 'react';
import './App.css';

type Task = {
  id: number;
  title: string;
  isCompleted: boolean;
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState<string>('');
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  const saveTasksToLocalStorage = (tasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const addTask = () => {
    if (newTask.trim() === '') return;

    const newTaskObject: Task = {
      id: Date.now(),
      title: newTask,
      isCompleted: false,
    };

    const updatedTasks = [...tasks, newTaskObject];
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setNewTask('');
  };

  const toggleTaskCompletion = (id: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const startEditingTask = (id: number, title: string) => {
    setEditTaskId(id);
    setEditTaskTitle(title);
  };

  const saveEditedTask = () => {
    if (editTaskId === null || editTaskTitle.trim() === '') return;

    const updatedTasks = tasks.map(task =>
      task.id === editTaskId ? { ...task, title: editTaskTitle } : task
    );

    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setEditTaskId(null);
    setEditTaskTitle('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.isCompleted;
    if (filter === 'incomplete') return !task.isCompleted;
    return true;
  });

  return (
    <div className="App">
      <div>
      <h1>To-Do List</h1>

      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : 'inactive'}>All</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : 'inactive'}>Completed</button>
        <button onClick={() => setFilter('incomplete')} className={filter === 'incomplete' ? 'active' : 'inactive'}>Incomplete</button>
      </div>

      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id} className="item">
            <span onClick={() => toggleTaskCompletion(task.id)} className={task.isCompleted ? 'completed' : 'incomplete'}>
              {task.isCompleted ? '✔️' : '⬜'} {task.title}
            </span>
            <div className='buttons'>
            <button onClick={() => startEditingTask(task.id, task.title)} className='task-list-edit'>Edit</button>
            <button onClick={() => deleteTask(task.id)} className='task-list-delete'>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editTaskId !== null && (
        <div className="edit-task">
          <input
            type="text"
            value={editTaskTitle}
            onChange={e => setEditTaskTitle(e.target.value)}
            placeholder="Edit task..."
          />
          <button onClick={saveEditedTask}>Save</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default App;
