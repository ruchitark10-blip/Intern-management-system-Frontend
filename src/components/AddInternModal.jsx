import React, { useState } from "react";

export default function AddInternModal({ onAdd, onClose, initialData = null }) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [mentor, setMentor] = useState(initialData?.mentor ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "Active");
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const submit = () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Enter a valid email (example@gmail.com)");
      return;
    }

    if (!mentor.trim()) {
      setError("Mentor name is required");
      return;
    }

    setError("");

    const newIntern = {
      name,
      email,
      mentor,
      status,
    };

    onAdd(newIntern);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-xl w-96 space-y-3">
        <h2 className="font-bold text-lg">
          {initialData ? "Edit Intern" : "Add Intern"}
        </h2>

        <input
          className="border w-full p-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border w-full p-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border w-full p-2"
          placeholder="Mentor"
          value={mentor}
          onChange={(e) => setMentor(e.target.value)}
        />

        <select
          className="border w-full p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {initialData ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}