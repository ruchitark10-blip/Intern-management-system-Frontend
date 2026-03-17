import React, { useState, useEffect } from "react";

const AddTaskModal = ({ isOpen, onClose, onAddTask, intern }) => {
  // Get current date in YYYY-MM-DD format for HTML input logic
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    taskName: "",
    taskDescription: "",
    assignDate: today, 
    deadline: ""
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        taskName: "",
        taskDescription: "",
        assignDate: today,
        deadline: ""
      });
    }
  }, [isOpen, today]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Helper to format YYYY-MM-DD to DD-MM-YYYY for your database/view
    const formatToCustomDate = (dateStr) => {
      if (!dateStr) return "";
      const [y, m, d] = dateStr.split("-");
      return `${d}-${m}-${y}`;
    };

    const taskPayload = {
      internId: intern?._id, // Linked to the specific row
      taskName: formData.taskName,
      description: formData.taskDescription,
      assignDate: formatToCustomDate(formData.assignDate),
      deadline: formatToCustomDate(formData.deadline),
      status: "Pending"
    };

    onAddTask(taskPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-[Poppins]">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border">
        
        {/* Header - Auto-filled from row */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-[#1F2A5B]">Assign Task to {intern?.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Task Name */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Task Name</label>
            <input
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Task Description</label>
            <textarea
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 rounded-xl h-24 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              required
            />
          </div>

          {/* Date Picker Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Assign Date - Accepts current and future dates only */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Assign Date</label>
              <input
                type="date"
                name="assignDate"
                value={formData.assignDate}
                min={today} 
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            {/* Deadline Date - Accepts only future dates relative to Assign Date */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                min={formData.assignDate || today} 
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#2563EB] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98] mt-2"
          >
            Assign Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;