"use client";

import React, { useState, useEffect } from "react";
import { Eye, AlertCircle, X, Info } from "lucide-react";

export default function TaskPage({ iemail }) {
  const [tasks, setTasks] = useState([]);
  const [internData, setInternData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const loadTaskData = async () => {
      try {
        setLoading(true);
        const internRes = await fetch("http://localhost:5000/api/interns");
        const interns = await internRes.json();
        const current = interns.find(i => i.email?.toLowerCase().trim() === iemail?.toLowerCase().trim());

        if (!current) {
          setLoading(false);
          return;
        }
        setInternData(current);

        const taskRes = await fetch("http://localhost:5000/api/tasks");
        const allTasks = await taskRes.json();

        const myTasks = allTasks.filter(t => {
          const taskRef = typeof t.internId === "object" ? t.internId?._id : t.internId;
          return String(taskRef) === String(current._id);
        });

        setTasks(myTasks);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };

    if (iemail) loadTaskData();
  }, [iemail]);

  // Extracts first two letters of the name (e.g., "Rashi" -> "RA")
  const initials = internData?.name 
    ? internData.name.trim().substring(0, 2).toUpperCase() 
    : "??";

  if (loading) return <div className="p-10 text-center font-sans text-gray-400">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      
      {/* UPDATED NAVBAR: Name & ID on Left, Initials on Right */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-[#1F2A5B] leading-tight">My Tasks</h1>
          <div className="flex flex-col mt-0.5">
            <span className="text-sm font-semibold text-gray-600">Welcome back, {internData?.name}</span>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">ID: {internData?._id}</span>
          </div>
        </div>

        {/* Right side circle with first 2 letters */}
        <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-md border-2 border-white">
          {initials}
        </div>
      </nav>

      {/* TRACKING MESSAGE LINE */}
      <div className="px-8 py-3 bg-white/30 border-b border-gray-500">
        <p className="text-[15px] text-gray-700 font-medium italic">
          Track your progress and deliverables
        </p>
      </div>

      <div className="p-8">
        {/* TASK TABLE */}
        {tasks.length === 0 ? (
          <div className="bg-white border rounded-3xl p-24 text-center shadow-sm">
            <AlertCircle className="mx-auto text-gray-200 mb-4" size={56} />
            <h2 className="text-gray-400 font-medium">No tasks assigned yet</h2>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-6 font-semibold">TASK NAME</th>
                  <th className="px-10 py-6 font-semibold">ASSIGNED ON</th>
                  <th className="px-10 py-6 font-semibold">DEADLINE</th>
                  <th className="px-10 py-6 font-semibold">STATUS</th>
                  <th className="px-10 py-6 text-center font-semibold">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map((task, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/20 transition-all">
                    <td className="px-10 py-6 font-semibold text-gray-700">
                      {task.taskName || task.title}
                    </td>
                    <td className="px-10 py-6 text-gray-500 text-sm">
                      {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "---"}
                    </td>
                    <td className="px-10 py-6 text-gray-500 text-sm">
                      {task.deadline || "Ongoing"}
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm
                        ${task.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <button 
                        onClick={() => setSelectedTask(task)}
                        className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-100 transition-all shadow-sm"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW MODAL (DETAILS POPUP) */}
      {selectedTask && (
        <div className="fixed inset-0 bg-[#1F2A5B]/20 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Info size={24} />
                </div>
                <h3 className="font-extrabold text-xl text-[#1F2A5B]">Task Specification</h3>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div>
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] block mb-2">Title</label>
                <p className="text-gray-900 font-bold text-2xl">{selectedTask.taskName || selectedTask.title}</p>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] block mb-2">Description</label>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  {selectedTask.description || selectedTask.taskDescription || "No further details provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                  <label className="text-[9px] uppercase font-black text-blue-400 block mb-1">Status</label>
                  <span className="text-sm font-black text-blue-700 uppercase">{selectedTask.status}</span>
                </div>
                <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                  <label className="text-[9px] uppercase font-black text-orange-400 block mb-1">Deadline</label>
                  <span className="text-sm font-black text-orange-700">{selectedTask.deadline || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="p-8 text-center">
              <button 
                onClick={() => setSelectedTask(null)}
                className="w-full bg-[#1F2A5B] text-white py-4 rounded-2xl font-black text-sm hover:shadow-lg hover:bg-[#2a3a7a] transition-all transform hover:-translate-y-1"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}