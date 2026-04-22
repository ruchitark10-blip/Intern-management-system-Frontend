"use client";

import React, { useState, useEffect } from "react";
import { Users, ClipboardList, ClipboardClock, Eye, Trash2 } from "lucide-react";
import AddTaskModal from "./AddTaskModal";

// ✅ Helper to get Initials from Name or Email (Same as Intern Dashboard logic)
const getInitials = (name, email) => {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  return email ? email.substring(0, 2).toUpperCase() : "??";
};

export default function Dashboard({ memail }) {
  const [data, setData] = useState([]); // Filtered Interns
  const [allInterns, setAllInterns] = useState([]);
  const [mentorData, setMentorData] = useState(null); // ✅ Stores specific Mentor profile
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [viewIntern, setViewIntern] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [mentorTasks, setMentorTasks] = useState([]);

  // ✅ FETCH MENTOR PROFILE (Matches your Intern Dashboard logic)
  const fetchMentorProfile = async () => {
    try {
      const res = await fetch("https://intern-management-system-backend-za7h.onrender.com/api/mentors");
      const mentors = await res.json();

      const currentMentor = mentors.find(
        (m) => m.email?.toLowerCase().trim() === memail?.toLowerCase().trim()
      );

      if (currentMentor) {
        setMentorData(currentMentor);
      }
    } catch (err) {
      console.error("Error fetching mentor profile:", err);
    }
  };

  const fetchInterns = async () => {
    try {
      const res = await fetch("https://intern-management-system-backend-za7h.onrender.com/api/interns");
      const backendData = await res.json();
      setAllInterns(Array.isArray(backendData) ? backendData.sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate)) : []);
    } catch (err) { console.error(err); }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("https://intern-management-system-backend-za7h.onrender.com/api/tasks");
      const backendData = await res.json();
      setAllTasks(Array.isArray(backendData) ? backendData : []);
    } catch (err) { console.error(err); }
  };

  // ✅ FILTER LOGIC (Stays the same, now triggered by mentorData)
  useEffect(() => {
    if (!mentorData) return;

    const mentorNameLower = mentorData.name.toLowerCase().trim();

    const filteredInterns = allInterns.filter((intern) => 
      intern.mentorName?.toLowerCase().trim() === mentorNameLower || 
      intern.mentor?.toLowerCase().trim() === mentorNameLower
    );
    setData(filteredInterns);

    const myInternIds = filteredInterns.map((i) => i._id?.toString());
    const filteredTasks = allTasks.filter((task) => {
      const taskInternId = typeof task.internId === "object" ? task.internId?._id : task.internId;
      return myInternIds.includes(taskInternId?.toString());
    });
    setMentorTasks(filteredTasks);
  }, [mentorData, allInterns, allTasks]);

  useEffect(() => {
    fetchInterns();
    fetchTasks();
    if (memail) fetchMentorProfile();
  }, [memail]);

  const stats = [
    { title: "Assigned Interns", value: data.length, color: "bg-orange-100 text-orange-600", icon: Users },
    { title: "Tasks Assigned", value: mentorTasks.length, color: "bg-blue-100 text-blue-600", icon: ClipboardList },
    { title: "Pending Reviews", value: mentorTasks.filter(t => t.status === "Reviewing" || t.status === "Pending").length, color: "bg-purple-100 text-purple-600", icon: ClipboardClock },
  ];

  return (
    <div className="min-h-screen font-[Poppins] bg-gray-50">
      
      {/* ✅ NAVBAR: Now displays Name and Dynamic Initials */}
      <div className="flex justify-between items-center border-b px-6 py-4 bg-white shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F2A5B]">Dashboard</h1>
          <p className="text-xs text-gray-500">
            Welcome back, {mentorData?.name || memail}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
            {getInitials(mentorData?.name, memail)}
          </div>
        </div>
      </div>

      {/* STATS SECTION (Working as before) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}><Icon className="w-5 h-5" /></div>
              <div className="mt-3">
                <p className="text-sm text-gray-400 uppercase font-medium">{item.title}</p>
                <h2 className="text-xl font-bold">{item.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* MY INTERNS TABLE (Working as before) */}
      <div className="px-4 mt-4">
        <h2 className="text-green-600 font-bold text-lg mb-2">My Interns</h2>
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
              {data.map((i) => (
                <tr key={i._id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {i.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{i.name}</p>
                      <p className="text-xs text-gray-400">{i.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {i.joinedDate ? new Date(i.joinedDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-4 flex justify-end gap-3">
                    <button 
                      onClick={() => { setSelectedIntern(i); setIsTaskModalOpen(true); }} 
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-700"
                    >
                      Assign Task
                    </button>
                    <button onClick={() => setViewIntern(i)} className="text-gray-400 hover:text-blue-500">View</button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">No interns found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL Logic (Working as before) */}
      {isTaskModalOpen && selectedIntern && (
        <AddTaskModal 
          isOpen={isTaskModalOpen} 
          intern={selectedIntern} 
          onClose={() => setIsTaskModalOpen(false)} 
          onAddTask={async (payload) => {
            await fetch("https://intern-management-system-backend-za7h.onrender.com/api/tasks", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            setIsTaskModalOpen(false);
            fetchTasks();
          }} 
          memail={memail} 
        />
      )}

      {/* VIEW MODAL Logic */}
      {viewIntern && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl border">
            <h2 className="font-bold text-lg mb-4 text-[#1F2A5B]">Intern Details</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><b>Name:</b> {viewIntern.name}</p>
              <p><b>Email:</b> {viewIntern.email}</p>
              <p><b>Joined Date:</b> {new Date(viewIntern.joinedDate).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setViewIntern(null)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}