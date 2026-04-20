"use client";

import React, { useState, useEffect } from "react";

export default function AddInternModal({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [mentor, setMentor] = useState("");
  const [status, setStatus] = useState("Active");
  const [joinedDate, setJoinedDate] = useState("");
  const [duration, setDuration] = useState(""); // ✅ ADDED
  const [mentorsList, setMentorsList] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const nameRegex = /^[A-Za-z ]+$/;

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/mentors");
      const data = await res.json();
      setMentorsList(data);
    } catch (err) {
      console.error("Error fetching mentors", err);
    }
  };

  const submit = async () => {
    if (!name.trim()) return setError("Name is required");
    if (!nameRegex.test(name.trim()))
      return setError("Name should contain only letters");

    if (!gmailRegex.test(email.trim()))
      return setError("Email must be a valid @gmail.com address");

    if (!college.trim()) return setError("College is required");
    if (!department.trim()) return setError("Department is required");
    if (!mentor) return setError("Please select a mentor");
    if (!joinedDate) return setError("Please select a joining date");
    if (!duration) return setError("Please select internship duration"); // ✅ ADDED

    const today = new Date().toISOString().split("T")[0];

    if (joinedDate.slice(0, 4) !== "2026") {
      return setError("Only dates from the year 2026 are allowed");
    }

    if (joinedDate > today) {
      return setError("Future dates are not allowed");
    }

    setError("");
    setLoading(true);

    const internData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      college: college.trim(),
      department: department.trim(),
      mentor,
      status,
      joinedDate,
      duration: Number(duration), // ✅ IMPORTANT FIX
    };

    try {
      const response = await fetch("http://localhost:5000/api/interns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(internData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to add intern");
        setLoading(false);
        return;
      }

      alert(`Intern Created Successfully!

Email: ${result.email}
Password: ${result.password}

Please save this password.`);

      // RESET FORM
      setName("");
      setEmail("");
      setCollege("");
      setDepartment("");
      setMentor("");
      setStatus("Active");
      setJoinedDate("");
      setDuration(""); // ✅ RESET

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
          placeholder="Email (@gmail.com)"
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

        {/* MENTOR */}
        <select
          className="border w-full p-2 rounded"
          value={mentor}
          onChange={(e) => setMentor(e.target.value)}
        >
          <option value="">Select Mentor</option>
          {mentorsList.map((m) => (
            <option key={m._id} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>

        {/* STATUS */}
        <select
          className="border w-full p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Active">Active</option>
        </select>

        {/* JOINED DATE */}
        <input
          type="date"
          className="border w-full p-2 rounded"
          value={joinedDate}
          onChange={(e) => setJoinedDate(e.target.value)}
          min="2026-01-01"
          max={new Date().toISOString().split("T")[0]}
        />

        {/* ✅ DURATION (NEW FIX) */}
        <select
          className="border w-full p-2 rounded"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          <option value="">Select Duration</option>
          <option value="3">3 Months</option>
          <option value="6">6 Months</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

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