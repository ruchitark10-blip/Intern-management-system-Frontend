import { Eye, Edit, Trash2, Plus, Search, Filter } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import AddMentorModal from "./AddMentorModal";

const ITEMS_PER_PAGE = 10;

// ✅ initials function
const getInitials = (text) => {
  if (!text) return "";
  const words = text.trim().split(" ");
  return words.length === 1
    ? words[0].slice(0, 2).toUpperCase()
    : (words[0][0] + words[1][0]).toUpperCase();
};

export default function MentorsTable() {
  const [mentors, setMentors] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const [editMentor, setEditMentor] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [viewMentor, setViewMentor] = useState(null);

  const [loading, setLoading] = useState(false);

  // FETCH
  const fetchMentors = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://intern-management-system-backend-za7h.onrender.com/api/mentors");
      const data = await res.json();
      setMentors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching mentors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  // FILTER
  const filteredMentors = useMemo(() => {
    return mentors.filter((m) => {
      if (statusFilter !== "All" && m.status !== statusFilter) return false;
      if (!search) return true;

      const s = search.toLowerCase();

      return (
        m.name?.toLowerCase().includes(s) ||
        m.email?.toLowerCase().includes(s) ||
        m.contact?.includes(search)
      );
    });
  }, [mentors, search, statusFilter]);

  const totalPages = Math.ceil(filteredMentors.length / ITEMS_PER_PAGE);

  const paginatedMentors = filteredMentors.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // ADD
  const handleAdd = (mentor) => {
    setMentors((prev) => [...prev, mentor]);
    setAddOpen(false);
  };

  // UPDATE
  const handleUpdate = (updatedMentor) => {
    setMentors((prev) =>
      prev.map((m) => (m._id === updatedMentor._id ? updatedMentor : m))
    );
    setEditMentor(null);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this mentor?")) return;

    try {
      await fetch(`https://intern-management-system-backend-za7h.onrender.com/api/mentors/${id}`, {
        method: "DELETE",
      });

      setMentors((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // STATUS
  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`https://intern-management-system-backend-za7h.onrender.com/api/mentors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setMentors((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      console.error("Status error:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row border-b justify-between items-start lg:items-center py-[14px] px-4 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Mentors</h1>
          <p className="text-md text-gray-500">Manage all mentors here.</p>
        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={16} /> Add Mentor
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="p-4 flex gap-3">

        <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 flex-1">
          <Search size={18} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search mentor..."
            className="outline-none text-sm w-full bg-transparent"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
          >
            <Filter size={18} /> {statusFilter}
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow">
              {["All", "Active", "Inactive", "Completed"].map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
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
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-400">
          <tr>
            <th className="p-4 text-left">Mentor</th>
            <th className="p-4 text-center">Contact</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {paginatedMentors.map((m) => (
            <tr key={m._id} className="hover:bg-gray-50">

              <td className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                  {getInitials(m.name) || "M"}
                </div>

                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.email}</p>
                </div>
              </td>

              <td className="p-4 text-center">{m.contact}</td>

              <td className="p-4 text-center">
                <select
                  value={m.status}
                  onChange={(e) =>
                    handleStatusChange(m._id, e.target.value)
                  }
                  className={`px-3 py-1 rounded-full text-xs font-semibold border
                  ${
                    m.status === "Active"
                      ? "bg-green-100 text-green-700 border-green-300"
                      : m.status === "Inactive"
                      ? "bg-red-100 text-red-700 border-red-300"
                      : "bg-blue-100 text-blue-700 border-blue-300"
                  }`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>

              <td className="p-4 text-center">
                <div className="flex justify-center gap-3">
                  <Eye size={16} onClick={() => setViewMentor(m)} className="cursor-pointer" />
                  <Edit size={16} onClick={() => setEditMentor(m)} className="text-blue-500 cursor-pointer" />
                  <Trash2 size={16} onClick={() => handleDelete(m._id)} className="text-red-500 cursor-pointer" />
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ PAGINATION (UPDATED LIKE YOUR IMAGE) */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-1.5 rounded-md border text-sm
            ${page === 1 
              ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
              : "bg-white text-gray-600 hover:bg-gray-100"}
          `}
        >
          Previous
        </button>

        <span className="text-sm text-gray-700 font-medium">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-1.5 rounded-md border text-sm
            ${page === totalPages || totalPages === 0
              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-100"}
          `}
        >
          Next
        </button>

      </div>

      {/* MODALS */}
      {addOpen && <AddMentorModal onAdd={handleAdd} onClose={() => setAddOpen(false)} />}
      {editMentor && <AddMentorModal initialData={editMentor} onAdd={handleUpdate} onClose={() => setEditMentor(null)} />}

      {viewMentor && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="font-bold mb-3">Mentor Details</h2>
            <p><b>Name:</b> {viewMentor.name}</p>
            <p><b>Email:</b> {viewMentor.email}</p>
            <p><b>Contact:</b> {viewMentor.contact}</p>
            <p><b>Status:</b> {viewMentor.status}</p>
            <button onClick={() => setViewMentor(null)} className="mt-4 px-4 py-2 border rounded">
              Close
            </button>
          </div>
        </div>
      )}

      {loading && <p className="p-4 text-gray-500">Loading...</p>}
    </div>
  );
}