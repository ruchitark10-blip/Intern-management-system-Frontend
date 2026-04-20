import React, { useState } from "react";

export default function AddMentorModal({ onAdd, onClose, initialData = null }) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [contact, setContact] = useState(initialData?.contact ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "Active");
  const [joinedDate, setJoinedDate] = useState(initialData?.joinedDate ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactRegex = /^[0-9]{10}$/;
  const nameRegex = /^[A-Za-z ]+$/;

  const submit = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const digitsOnlyContact = contact.replace(/\D/g, "");

    // NAME
    if (!trimmedName) return setError("Name is required");
    if (!nameRegex.test(trimmedName))
      return setError("Name should contain only letters");

    // EMAIL
    if (!emailRegex.test(trimmedEmail))
      return setError("Enter a valid email");

    // CONTACT
    if (!contactRegex.test(digitsOnlyContact))
      return setError("Enter a valid 10-digit contact number");

    // DATE REQUIRED
    if (!joinedDate) return setError("Please select joined date");

    const selectedDate = new Date(joinedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    // ❌ ONLY 2026
    if (selectedDate.getFullYear() !== 2026) {
      return setError("Joined date must be in the year 2026 only");
    }

    // ❌ NO FUTURE DATE (ALLOW UP TO TODAY ONLY)
    if (selectedDate > today) {
      return setError("Joined date cannot be in the future");
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://intern-management-system-backend-za7h.onrender.com/api/mentors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          contact: digitsOnlyContact,
          status,
          joinedDate
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to add mentor");
        setLoading(false);
        return;
      }

      alert(`Mentor Created Successfully!

Email: ${data.email}
Password: ${data.password}`);

      onAdd(data);

      setName("");
      setEmail("");
      setContact("");
      setStatus("Active");
      setJoinedDate("");

      onClose();
    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-xl w-96 space-y-3">
        <h2 className="font-bold">
          {initialData ? "Edit Mentor" : "Add Mentor"}
        </h2>

        <input
          className="border w-full p-2"
          placeholder="Mentor Name"
          value={name}
          onChange={(e) => {
            const val = e.target.value;
            if (/^[A-Za-z ]*$/.test(val)) setName(val);
          }}
        />

        <input
          className="border w-full p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />

        <input
          className="border w-full p-2"
          placeholder="Contact Number"
          value={contact}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setContact(val.slice(0, 10));
          }}
          type="tel"
        />

        <input
          type="date"
          className="border w-full p-2"
          value={joinedDate}
          onChange={(e) => setJoinedDate(e.target.value)}
          min="2026-01-01"
          max={new Date().toISOString().split("T")[0]}
        />

        {/* ONLY ACTIVE */}
        <select
          className="border w-full p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Active">Active</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : initialData ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}