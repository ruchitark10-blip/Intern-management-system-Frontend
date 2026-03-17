"use client";

import { useState, useEffect, useMemo } from "react";
import { Eye, Trash2, Search, Filter, ClipboardList } from "lucide-react";
import AddTaskModal from "./AddTaskModal";

export default function MentorInternTable() {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [viewIntern, setViewIntern] = useState(null);

  // FETCH ALL INTERNS
  const fetchInterns = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/interns");
      const backendData = await res.json();
      setData(Array.isArray(backendData) ? backendData : []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
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
      } else {
        const errorData = await response.json();
        alert("Failed to assign task: " + (errorData.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Database connection error:", err);
      alert("Could not connect to the server. Is your backend running?");
    }
  };

  // STATUS CHANGE
  const handleStatusChange = async (id, newStatus) => {
    setData(prev => prev.map(i => (i._id === id ? { ...i, status: newStatus } : i)));
    try {
      await fetch(`http://localhost:5000/api/interns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Error updating status:", err);
      fetchInterns();
    }
  };

  // DELETE INTERN
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this intern?")) return;
    try {
      await fetch(`http://localhost:5000/api/interns/${id}`, { method: "DELETE" });
      setData(prev => prev.filter(item => item._id !== id));
    } catch (err) { console.error(err); }
  };

  // FILTER + SEARCH
  const filteredData = useMemo(() => {
    return data.filter(i => {
      if (filterStatus !== "All" && i.status !== filterStatus) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return i.name?.toLowerCase().includes(s) || i.email?.toLowerCase().includes(s);
    });
  }, [data, search, filterStatus]);

  // SORT filtered data by joinedDate descending (newest first)
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate));
  }, [filteredData]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="font-[Poppins] flex-1 flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b px-4 py-4 gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1F2A5B]">Interns</h1>
          <p className="text-sm text-gray-500">Manage all interns and track their progress.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">SI</div>
        </div>
      </div>

      <main className="p-6">
        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 flex-1">
            <Search size={18} className="text-gray-400" />
            <input 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
              placeholder="Search by name or email..." 
              className="outline-none w-full text-sm bg-transparent" 
            />
          </div>
          <div className="relative">
            <button onClick={() => setFilterOpen((p) => !p)} className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-600">
              <Filter size={18}/> {filterStatus === "All" ? "Filter" : filterStatus}
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-xl shadow-lg z-50">
                {["All", "Active", "Inactive"].map((s) => (
                  <div key={s} onClick={() => { setFilterStatus(s); setFilterOpen(false); setPage(1); }} className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">{s}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Intern Table */}
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
              {currentData.map((i) => (
                <tr key={i._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {i.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{i.name}</p>
                      <p className="text-xs text-gray-400 mb-1">{i.email}</p>
                      <select
                        value={i.status || "Active"}
                        onChange={(e) => handleStatusChange(i._id, e.target.value)}
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border outline-none cursor-pointer appearance-none transition-all ${
                          i.status === "Active" ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        <option value="Active">Active ▼</option>
                        <option value="Inactive">Inactive ▼</option>
                      </select>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{i.joinedDate ? new Date(i.joinedDate).toLocaleDateString() : "N/A"}</td>
                  <td className="p-4 flex justify-end gap-3">
                    <button 
                      onClick={() => { setSelectedIntern(i); setIsTaskModalOpen(true); }}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1.5 transition-colors"
                    >
                      <ClipboardList size={14}/> Assign Task
                    </button>
                    <button onClick={() => setViewIntern(i)} className="text-gray-400 hover:text-blue-500"><Eye size={18}/></button>
                    <button onClick={() => handleDelete(i._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-t">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="border border-orange-400 text-orange-500 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-orange-50 disabled:opacity-30">Previous</button>
            <p className="text-gray-400 text-xs font-medium">Page {page} of {totalPages || 1}</p>
            <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)} className="border border-orange-400 text-orange-500 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-orange-50 disabled:opacity-30">Next</button>
          </div>
        </div>
      </main>

      {/* Task Modal */}
      {isTaskModalOpen && selectedIntern && (
        <AddTaskModal 
          isOpen={isTaskModalOpen} 
          intern={selectedIntern} 
          onClose={() => setIsTaskModalOpen(false)} 
          onAddTask={handleAddTask} 
        />
      )}

      {/* View Modal */}
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