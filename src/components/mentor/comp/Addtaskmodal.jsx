import React, { useState } from "react";

const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [formData, setFormData] = useState({
    taskName: "",
    internName: "",
    taskDescription: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      name: formData.internName,
      email: `${formData.internName.toLowerCase().replace(/\s+/g, ".")}@company.com`,
      avatar: "https://i.pravatar.cc/40",
      task: formData.taskName,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };

    onAddTask(newTask);
    onClose();

    setFormData({
      taskName: "",
      internName: "",
      taskDescription: ""
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Assign New Task
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="taskName"
            placeholder="Task Name"
            value={formData.taskName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="text"
            name="internName"
            placeholder="Intern Name"
            value={formData.internName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="taskDescription"
            placeholder="Task Description"
            value={formData.taskDescription}
            onChange={handleChange}
            className="w-full border p-2 rounded h-24"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Assign Task
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;