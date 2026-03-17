"use client";

import { useState, useMemo, useEffect } from "react";
import { Bell, Plus, Search, Filter, Eye, Trash2 } from "lucide-react";
import AddInternModal from "./AddInternModal";

export default function InternsPage() {
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [viewIntern, setViewIntern] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/interns");
      const data = await res.json();
      setInterns(data);
    } catch (err) {
      console.error("Error fetching interns", err);
    }
  };

  // SEARCH + FILTER
  const filteredInterns = useMemo(() => {
    return interns.filter((i) => {
      if (filterStatus !== "All" && i.status !== filterStatus) return false;
      if (!search) return true;

      const s = search.toLowerCase();

      return (
        i.name?.toLowerCase().includes(s) ||
        i.email?.toLowerCase().includes(s) ||
        i.mentor?.toLowerCase().includes(s)
      );
    });
  }, [interns, search, filterStatus]);

  const totalPages = Math.ceil(filteredInterns.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const paginatedInterns = filteredInterns.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // DELETE INTERN
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this intern?"
    );

    if (!confirmed) return;

    try {
      await fetch(`http://localhost:5000/api/interns/${id}`, {
        method: "DELETE",
      });

      setInterns((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Error deleting intern", err);
    }
  };

  // UPDATE STATUS
  const handleStatusChange = async (id, newStatus) => {
    setInterns((prev) =>
      prev.map((i) => (i._id === id ? { ...i, status: newStatus } : i))
    );

    try {
      await fetch(`http://localhost:5000/api/interns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row border-b justify-between items-start lg:items-center py-[14px] px-4 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Interns</h1>
          <p className="text-gray-500">
            Manage all interns and track their progress.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-700"
          >
            <Plus size={16} /> Add Intern
          </button>

          {/* Bell icon removed */}
          {/* <Bell size={20} className="text-gray-400" /> */}

          <div className="h-9 w-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            SI
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="p-6">

        {/* SEARCH + FILTER */}
        <div className="flex items-center gap-3 mb-6">

          <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 flex-1">
            <Search size={18} className="text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or mentor..."
              className="outline-none text-sm w-full bg-transparent"
            />
          </div>

          <div className="relative">

            <button
              onClick={() => setFilterOpen((p) => !p)}
              className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-600"
            >
              <Filter size={18} />
              {filterStatus === "All" ? "Filter" : filterStatus}
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-xl shadow z-50">
                {["All", "Active", "Inactive", "Completed"].map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setFilterStatus(s);
                      setFilterOpen(false);
                      setPage(1);
                    }}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-400">
              <tr>
                <th className="p-4 text-left">Intern</th>
                <th className="p-4 text-left">Joined Date</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {paginatedInterns.map((i) => (
                <tr key={i._id} className="hover:bg-gray-50">

                  <td className="p-4 flex items-center gap-3">

                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                      {i.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold">{i.name}</p>
                      <p className="text-xs text-gray-400">{i.email}</p>

                      <select
                        className={`mt-1 text-xs rounded px-2 py-1 border ${
                          i.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : i.status === "Inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                        value={i.status}
                        onChange={(e) =>
                          handleStatusChange(i._id, e.target.value)
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                  </td>

                  <td className="p-4">
                    {new Date(i.joinedDate).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-center flex justify-center gap-4">

                    <Eye
                      size={18}
                      className="cursor-pointer text-gray-400 hover:text-gray-600"
                      onClick={() => setViewIntern(i)}
                    />

                    <Trash2
                      size={18}
                      className="cursor-pointer text-red-400 hover:text-red-600"
                      onClick={() => handleDelete(i._id)}
                    />

                  </td>

                </tr>
              ))}

            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-between items-center p-4 text-sm">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="border px-4 py-1.5 rounded-lg disabled:text-gray-300"
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages || 1}
            </span>

            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="border px-4 py-1.5 rounded-lg disabled:text-gray-300"
            >
              Next
            </button>

          </div>
        </div>
      </main>

      {/* VIEW MODAL */}
      {viewIntern && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96 space-y-3">

            <h2 className="font-bold text-lg">Intern Details</h2>

            <p><b>Name:</b> {viewIntern.name}</p>
            <p><b>Email:</b> {viewIntern.email}</p>
            <p><b>College:</b> {viewIntern.college}</p>
            <p><b>Department:</b> {viewIntern.department}</p>
            <p><b>Mentor:</b> {viewIntern.mentor}</p>
            <p><b>Status:</b> {viewIntern.status}</p>
            <p><b>Joined Date:</b> {new Date(viewIntern.joinedDate).toLocaleDateString()}</p>

            <div className="flex justify-end">
              <button
                onClick={() => setViewIntern(null)}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD INTERN MODAL */}
      {isOpen && (
        <AddInternModal
          onClose={(newIntern) => {
            setIsOpen(false);
            if (newIntern) setInterns((prev) => [...prev, newIntern]);
          }}
        />
      )}
    </div>
  );
}