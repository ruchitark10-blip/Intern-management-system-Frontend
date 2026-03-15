import React, { useState } from "react";

export default function AddMentorModal({ onAdd, onClose, initialData = null }) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [contact, setContact] = useState(initialData?.contact ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "Active");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactRegex = /^[0-9]{10}$/;

  const submit = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const digitsOnlyContact = contact.replace(/\D/g, ""); // remove non-digit chars

    if (!trimmedName) {
      setError("Name is required");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError("Enter a valid email");
      return;
    }

    if (!contactRegex.test(digitsOnlyContact)) {
      setError("Enter a valid 10-digit contact number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          contact: digitsOnlyContact,
          status,
        }),
      });

      const data = await response.json();

      console.log("Backend response:", data, response.status); // for debugging

      if (!response.ok) {
        // Show backend error directly
        setError(data.error || "Failed to add mentor");
        setLoading(false);
        return;
      }

      onAdd(data); // update parent state
      setLoading(false);
      onClose(); // close modal
    } catch (err) {
      console.error("Network or server error:", err);
      setError("Server error. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-xl w-96 space-y-3">
        <h2 className="font-bold mb-1">
          {initialData ? "Edit Mentor" : "Add Mentor"}
        </h2>

        <input
          className="border w-full p-2"
          placeholder="Mentor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            // Only digits, max 10 characters
            const value = e.target.value.replace(/\D/g, "");
            setContact(value.slice(0, 10));
          }}
          type="tel"
        />

        <select
          className="border w-full p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Active</option>
          <option>Inactive</option>
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