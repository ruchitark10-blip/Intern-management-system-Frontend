"use client";

import { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { Trash2, Search, Calendar } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";

const ITEMS_PER_PAGE = 6;

// ✅ Helper to get Initials from Name or Email
const getInitials = (name, email) => {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  return email ? email.substring(0, 2).toUpperCase() : "??";
};

export default function Companies({ memail }) {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]); 
  const [interns, setInterns] = useState([]);    
  const [mentorData, setMentorData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusOpen, setStatusOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [selectedTask, setSelectedTask] = useState(null);

  // FETCH MENTOR PROFILE
  const fetchMentor = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/mentors");
      const data = await res.json();
      const match = data.find(
        (m) => m.email?.toLowerCase().trim() === memail?.toLowerCase().trim()
      );
      if (match) {
        setMentorData(match);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH INTERNS
  const fetchInterns = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/interns");
      const data = await res.json();
      setInterns(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH ALL TASKS
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks");
      const backendData = await res.json();
      const safe = Array.isArray(backendData) ? backendData : [];
      setAllTasks(safe);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  // FILTER TASKS FOR THIS SPECIFIC MENTOR
  useEffect(() => {
    if (!mentorData || interns.length === 0 || allTasks.length === 0) {
      setTasks(allTasks); 
      return;
    }

    const mName = mentorData.name.toLowerCase().trim();

    const myInternIds = interns
      .filter(
        (i) =>
          i.mentorName?.toLowerCase().trim() === mName ||
          i.mentor?.toLowerCase().trim() === mName
      )
      .map((i) => i._id?.toString());

    const filteredByMentor = allTasks.filter((task) => {
      const taskInternId =
        typeof task.internId === "object" ? task.internId?._id : task.internId;
      return myInternIds.includes(taskInternId?.toString());
    });

    setTasks(filteredByMentor);
  }, [mentorData, interns, allTasks]);

  useEffect(() => {
    fetchMentor();
    fetchInterns();
    fetchTasks();
  }, [memail]);

  // --- HELPERS ---
  const formatToDisplay = (dateStr) => {
    if (!dateStr) return "N/A";
    return dateStr.replaceAll("-", "/");
  };

  const formatToISO = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      date.setDate(date.getDate() + 1);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return "";
  };

  const handleUpdateDeadline = async (taskId, newDateISO) => {
    const parts = newDateISO.split("-");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deadline: formattedDate }),
      });
      if (res.ok) {
        setAllTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, deadline: formattedDate } : t))
        );
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAllTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, { method: "DELETE" });
      setAllTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredData = tasks.filter((item) => {
    const matchesSearch = item.taskName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All Status" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "text-green-600";
      case "Completed": return "text-green-600";
      case "Pending": return "text-orange-500";
      case "Reviewing": return "text-yellow-600";
      case "Expired": return "text-red-600";
      default: return "text-[#1F2A5B]";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins]">
      
      {/* ✅ HEADER: Corrected initials logic */}
      <div className="flex justify-between items-center border-b px-6 py-4 bg-white shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F2A5B]">Assign Task</h1>
          <p className="text-xs text-gray-500">
            {mentorData?.name || memail}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md text-sm">
            {getInitials(mentorData?.name, memail)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 flex flex-col md:flex-row gap-3">
        <div className="relative w-full md:flex-[2] h-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="w-full h-full pl-10 pr-4 border rounded-sm text-sm outline-none bg-white shadow-sm"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative w-full md:flex-[1]">
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className="w-full flex justify-between items-center border px-3 py-2 text-sm rounded-sm bg-white font-medium shadow-sm"
          >
            {filterStatus} <IoIosArrowDown />
          </button>
          {statusOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg overflow-hidden">
              {["All Status", "Pending", "Active", "Reviewing", "Completed"].map((s) => (
                <div
                  key={s}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => { setFilterStatus(s); setStatusOpen(false); }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-4">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading tasks...</div>
        ) : (
          <table className="w-full min-w-[900px] text-sm bg-white border rounded-lg shadow-sm">
            <thead className="text-gray-400 border-b bg-gray-50 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="text-left py-4 ps-4">Task Title</th>
                <th className="text-center">Assigned Intern</th>
                <th className="text-center">Deadline</th>
                <th className="text-center">Status (Editable)</th>
                <th className="text-right pe-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 ps-4 font-semibold text-gray-700">{item.taskName}</td>
                  <td className="text-center text-gray-600">{item.internId?.name || "N/A"}</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-100">
                        {formatToDisplay(item.deadline)}
                      </span>
                      <div className="relative cursor-pointer text-gray-400 hover:text-blue-600">
                        <Calendar size={14} />
                        <input 
                          type="date"
                          min={formatToISO(item.assignDate)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          onChange={(e) => handleUpdateDeadline(item._id, e.target.value)}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                      className={`text-[11px] font-bold border rounded-md px-2 py-1 outline-none cursor-pointer appearance-none text-center ${
                        item.status === "Active" ? "bg-blue-50 text-blue-600 border-blue-200" :
                        item.status === "Completed" ? "bg-green-50 text-green-600 border-green-200" :
                        item.status === "Reviewing" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                        item.status === "Expired" ? "bg-red-50 text-red-600 border-red-200" :
                        "bg-orange-50 text-orange-600 border-orange-200"
                      }`}
                    >
                      <option value="Pending">Pending ▼</option>
                      <option value="Active">Active ▼</option>
                      <option value="Reviewing">Reviewing ▼</option>
                      <option value="Completed">Completed ▼</option>
                    </select>
                  </td>
                  <td className="text-right pe-4">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <FiEye className="cursor-pointer hover:text-blue-600 text-lg" onClick={() => setSelectedTask(item)} />
                      <Trash2 size={18} className="cursor-pointer hover:text-red-600" onClick={() => handleDelete(item._id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                   <td colSpan="5" className="p-8 text-center text-gray-500">No tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t text-sm bg-white mt-4 mx-4 rounded-lg shadow-sm">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="border border-orange-500 text-orange-500 px-6 py-2 rounded-lg disabled:opacity-30 font-medium"
        >
          Previous
        </button>
        <span className="text-gray-500 font-medium">Page {page} of {totalPages || 1}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
          className="border border-orange-500 text-orange-500 px-6 py-2 rounded-lg disabled:opacity-30 font-medium"
        >
          Next
        </button>
      </div>

      {/* View Task Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-[Poppins]">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-[#1F2A5B] mb-6 border-b pb-2">Full Task Details</h2>
            <div className="space-y-4">
              <DetailRow label="Intern Name" value={selectedTask.internId?.name} />
              <DetailRow label="Task Title" value={selectedTask.taskName} />
              <DetailRow label="Assign Date" value={formatToDisplay(selectedTask.assignDate)} />
              <DetailRow label="Deadline" value={formatToDisplay(selectedTask.deadline)} />
              <DetailRow label="Current Status" value={selectedTask.status} customColor={getStatusColor(selectedTask.status)} />
            </div>
            <button onClick={() => setSelectedTask(null)} className="w-full mt-8 bg-[#1F2A5B] py-3 rounded-xl font-bold text-white hover:bg-[#2a3a7d]">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, customColor }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <span className="text-[10px] text-black uppercase font-bold tracking-tight">{label}</span>
      <span className={`text-sm font-medium ${customColor || "text-[#1F2A5B]"}`}>{value || "N/A"}</span>
    </div>
  );
}