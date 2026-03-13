"use client";

import React, { useState } from "react";

export default function AddInternModal({ onClose }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [mentor, setMentor] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const submit = async () => {

    // Validation
    if (!name.trim()) return setError("Name is required");
    if (!emailRegex.test(email)) return setError("Enter a valid email");
    if (!college.trim()) return setError("College is required");
    if (!department.trim()) return setError("Department is required");
    if (!mentor.trim()) return setError("Mentor name is required");

    setError("");
    setLoading(true);

    const internData = {
      name: name.trim(),
      email: email.trim(),
      college: college.trim(),
      department: department.trim(),
      mentor: mentor.trim(),
      status: "Active"
    };

    try {

      const response = await fetch("http://localhost:5000/api/interns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(internData)
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to add intern");
        setLoading(false);
        return;
      }

      alert("Intern added successfully!");

      // Reset form
      setName("");
      setEmail("");
      setCollege("");
      setDepartment("");
      setMentor("");

      // Send new intern back to parent page
      onClose(result);

    } catch (err) {

      console.error(err);
      setError("Server error. Please try again.");

    }

    setLoading(false);
  };

  return (

    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">

      <div className="bg-white p-6 rounded-xl w-96 space-y-3">

        <h2 className="font-bold text-lg">Add Intern</h2>

        <input
          className="border w-full p-2 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border w-full p-2 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border w-full p-2 rounded"
          placeholder="College"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
        />

        <input
          className="border w-full p-2 rounded"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <input
          className="border w-full p-2 rounded"
          placeholder="Mentor Name"
          value={mentor}
          onChange={(e) => setMentor(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">

          <button
            onClick={() => onClose(null)}
            className="border px-3 py-1 rounded"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Create"}
          </button>

        </div>

      </div>

    </div>

  );
}