import { useState } from "react";

function AddTaskModal({ onAdd, onClose }) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!taskName) return;

    onAdd({
      name: taskName,
      description,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Assign Task</h2>

        <input
          type="text"
          placeholder="Task Name"
          className="w-full border p-2 rounded mb-3"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <textarea
          placeholder="Task Description"
          className="w-full border p-2 rounded mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-blue-600 text-white rounded"
          >
            Assign Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;