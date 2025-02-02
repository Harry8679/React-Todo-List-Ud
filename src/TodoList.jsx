import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const TaskItem = ({ task, editingId, editText, setEditText, startEditing, saveEdit, deleteTask }) => {
  return (
    <li className="flex justify-between items-center bg-gray-100 p-2 my-2 rounded-lg">
      {editingId === task.id ? (
        <input
          type="text"
          className="border px-2 py-1 rounded-lg flex-grow"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
      ) : (
        <span>{task.text}</span>
      )}
      <div className="flex gap-2">
        {editingId === task.id ? (
          <button
            className="bg-green-500 text-white px-3 py-1 rounded-lg"
            onClick={() => saveEdit(task.id)}
          >
            Sauvegarder
          </button>
        ) : (
          <button
            className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
            onClick={() => startEditing(task.id, task.text)}
          >
            Modifier
          </button>
        )}
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-lg"
          onClick={() => deleteTask(task.id)}
        >
          Supprimer
        </button>
      </div>
    </li>
  );
};

const TaskList = ({ tasks, editingId, editText, setEditText, startEditing, saveEdit, deleteTask }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          editingId={editingId}
          editText={editText}
          setEditText={setEditText}
          startEditing={startEditing}
          saveEdit={saveEdit}
          deleteTask={deleteTask}
        />
      ))}
    </ul>
  );
};

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskText.trim()) return;
    const newTask = { id: uuidv4(), text: taskText };
    setTasks([...tasks, newTask]);
    setTaskText("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: editText } : task))
    );
    setEditingId(null);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Todo List</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border rounded-lg px-3 py-2 flex-grow"
          placeholder="Ajouter une tâche"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={addTask}
        >
          Ajouter
        </button>
      </div>
      <TaskList
        tasks={tasks}
        editingId={editingId}
        editText={editText}
        setEditText={setEditText}
        startEditing={startEditing}
        saveEdit={saveEdit}
        deleteTask={deleteTask}
      />
    </div>
  );
}