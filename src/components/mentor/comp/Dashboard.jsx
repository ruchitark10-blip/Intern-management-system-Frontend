"use client";

import React, { useState, useEffect } from "react";
import { Users, ClipboardList, ClipboardClock } from "lucide-react";
import AddTaskModal from "./AddTaskModal";

export default function Dashboard({memail}) {
  const stats = [
    { title: "Assigned Interns", value: 12, color: "bg-orange-100 text-orange-600", icon: Users },
    { title: "Tasks Assigned", value: 25, color: "bg-blue-100 text-blue-600", icon: ClipboardList },
    { title: "Pending Reviews", value: 8, color: "bg-purple-100 text-purple-600", icon: ClipboardClock },
  ];

  const [data, setData] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [viewIntern, setViewIntern] = useState(null);

 
  // FETCH INTERNS
  const fetchInterns = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/interns");
      const backendData = await res.json();
      const sorted = Array.isArray(backendData)
        ? backendData.sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))
        : [];
      setData(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  // ADD TASK
  const handleAddTask = async (taskPayload) => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskPayload),
      });

      if (response.ok) {
        alert(`Task successfully assigned to ${selectedIntern.name}!`);
        setIsTaskModalOpen(false);
        fetchInterns(); // refresh list to show newest first
      } else {
        const errorData = await response.json();
        alert("Failed to assign task: " + (errorData.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Database connection error:", err);
      alert("Could not connect to the server. Is your backend running?");
    }
  };

  // DELETE INTERN
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this intern?")) return;
    try {
      await fetch(`http://localhost:5000/api/interns/${id}`, { method: "DELETE" });
      setData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Get 2 most recent interns (newest first)
  const recentActivityData = data.slice(0, 2);

  return (
    <div className="min-h-screen font-[Poppins] bg-gray-50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b px-4 py-4 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#1F2A5B]">Dashboard</h1>
          <p className="text-xs sm:text-sm text-[#1F2A5B]">Welcome back, {memail}</p>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm"><p>{memail.substring(0, 2)}</p></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-400 uppercase font-medium">{item.title}</p>
                <h2 className="text-xl font-bold">{item.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Table */}
      <div className="px-4 mt-4">
        <h2 className="text-green-600 font-bold text-lg mb-2">Recent Activity</h2>
        <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-400 border-b">
              <tr>
                <th className="p-4 font-medium">Intern</th>
                <th className="p-4 font-medium">Joined Date</th>
                <th className="p-4 text-right pr-8 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentActivityData.map(i => (
                <tr key={i._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {i.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{i.name}</p>
                      <p className="text-xs text-gray-400 mb-1">{i.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{i.joinedDate ? new Date(i.joinedDate).toLocaleDateString() : "N/A"}</td>
                  <td className="p-4 flex justify-end gap-3">
                    <button
                      onClick={() => { setSelectedIntern(i); setIsTaskModalOpen(true); }}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700"
                    >
                      Assign Task
                    </button>
                    <button
                      onClick={() => setViewIntern(i)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(i._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && selectedIntern && (
        <AddTaskModal
          isOpen={isTaskModalOpen}
          intern={selectedIntern}
          onClose={() => setIsTaskModalOpen(false)}
          onAddTask={handleAddTask}
        />
      )}

      {/* View Intern Modal */}
      {viewIntern && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl border">
            <h2 className="font-bold text-lg mb-4 text-[#1F2A5B]">Intern Details</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><b>Name:</b> {viewIntern.name}</p>
              <p><b>Email:</b> {viewIntern.email}</p>
              <p><b>Status:</b> {viewIntern.status}</p>
              <p><b>Joined Date:</b> {new Date(viewIntern.joinedDate).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setViewIntern(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}