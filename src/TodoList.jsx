import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5550/tasks";

const TaskItem = ({ task, editingId, editText, setEditText, startEditing, saveEdit, deleteTask }) => {
  return (
    <li className="flex justify-between items-center bg-gray-100 p-2 my-2 rounded-lg">
      {editingId === task._id ? (
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
        {editingId === task._id ? (
          <button
            className="bg-green-500 text-white px-3 py-1 rounded-lg"
            onClick={() => saveEdit(task._id)}
          >
            Sauvegarder
          </button>
        ) : (
          <button
            className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
            onClick={() => startEditing(task._id, task.text)}
          >
            Modifier
          </button>
        )}
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-lg"
          onClick={() => deleteTask(task._id)}
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
          key={task._id}
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
    axios.get(API_URL).then((response) => setTasks(response.data));
  }, []);

  const addTask = () => {
    if (!taskText.trim()) return;
    axios.post(API_URL, { text: taskText }).then((response) => {
      setTasks([...tasks, response.data]);
      setTaskText("");
    });
  };

  const deleteTask = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      setTasks(tasks.filter((task) => task._id !== id));
    });
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    axios.put(`${API_URL}/${id}`, { text: editText }).then((response) => {
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      setEditingId(null);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
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
          onKeyPress={handleKeyPress}
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