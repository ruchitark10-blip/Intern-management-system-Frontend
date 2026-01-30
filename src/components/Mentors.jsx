import { Eye, Edit, Trash2, Bell, Plus, Search, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import AddMentorModal from "./AddMentorModal";

const ITEMS_PER_PAGE = 10;

const initialMentors = [
  { id: 1, name: "Michael Roberts", email: "michael.r@company.com", interns: 52, status: "Active" },
  { id: 2, name: "James Miller", email: "emma.t@company.com", interns: 68, status: "Active" },
  { id: 3, name: "Lisa Wang", email: "lisa.w@company.com", interns: 45, status: "Inactive" },
  { id: 4, name: "David Kim", email: "david.k@company.com", interns: 34, status: "Active" },
  { id: 5, name: "David Kim", email: "david.k2@company.com", interns: 77, status: "Inactive" },
];

export default function MentorsTable() {
  

  const [mentors, setMentors] = useState(initialMentors);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const [editMentor, setEditMentor] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  /* 🔍 SEARCH + FILTER */
  const filteredMentors = useMemo(() => {
    return mentors.filter((m) => {
      if (statusFilter !== "All" && m.status !== statusFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(s) ||
        m.email.toLowerCase().includes(s)
      );
    });
  }, [mentors, search, statusFilter]);

 
  
  const totalPages = Math.ceil(filteredMentors.length / ITEMS_PER_PAGE);
  const paginatedMentors = filteredMentors.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

 

 
  const handleAdd = (mentor) => {
    setMentors([...mentors, { ...mentor, id: Date.now() }]);
    setAddOpen(false);
  };

  const handleUpdate = () => {
    setMentors(
      mentors.map((m) => (m.id === editMentor.id ? editMentor : m))
    );
    setEditMentor(null);
  };


  const handleDelete = (id) => {
    setMentors(mentors.filter((m) => m.id !== id));
  };

  
  const handleView = (mentor) => {
    alert(`Mentor: ${mentor.name}\nEmail: ${mentor.email}`);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden">
    
      <div className="flex flex-col lg:flex-row border-b justify-between items-start lg:items-center py-[14px] px-4 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          <p className="text-md text-gray-500">
            Welcome back, Sarah. Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setAddOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-700"
          >


            <Plus size={16} /> Add Mentor
          </button>
          <Bell size={20} className="text-gray-400" />
        </div>
      </div>


      <div className="p-4 flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 flex-1">
          <Search size={18} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Mentor, Interns name..."
            className="outline-none text-sm w-full bg-transparent"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen((p) => !p)}
            className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-600"
          >
            <Filter size={18} /> Filter
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-50">
              {["All", "Active", "Inactive"].map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setFilterOpen(false);
                    setPage(1);
                  }}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

  
      <table className="w-full text-sm m-2">
        <thead className="bg-gray-50 text-gray-400">
          <tr>
            <th className="p-4 text-left">Mentor Name</th>
            <th className="p-4 text-center">Assigned Interns</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {paginatedMentors.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="p-4 flex gap-3 items-center">
                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                  {m.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.email}</p>
                </div>
              </td>

              <td className="p-4 text-center">{m.interns}</td>

              <td className="p-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${m.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"}`}
                >
                  {m.status}
                </span>
              </td>

              <td className="p-4 text-center">
                <div className="flex justify-center gap-3">
                  <Eye size={16} onClick={() => handleView(m)} />
                  <Edit size={16} className="text-blue-500 cursor-pointer" onClick={() => setEditMentor(m)} />
                  <Trash2 size={16} className="text-red-500 cursor-pointer" onClick={() => handleDelete(m.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
      <div className="flex justify-between items-center p-4 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-1.5 rounded-lg border
            ${page === 1
              ? "text-gray-300 border-gray-300"
              : "text-orange-500 border-orange-500 hover:bg-orange-50"}`}
        >
          Previous
        </button>

        <span className="text-gray-600 font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-1.5 rounded-lg border
            ${page === totalPages
              ? "text-gray-300 border-gray-300"
              : "text-orange-500 border-orange-500 hover:bg-orange-50"}`}
        >
          Next
        </button>
      </div>
     
      {addOpen && (
        <AddMentorModal
          onAdd={handleAdd}
          onClose={() => setAddOpen(false)}
        />
      )}

      
      {editMentor && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h2 className="font-bold text-lg">Edit Mentor</h2>

            <input
              value={editMentor.name}
              onChange={(e) => setEditMentor({ ...editMentor, name: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              value={editMentor.email}
              onChange={(e) => setEditMentor({ ...editMentor, email: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setEditMentor(null)}>Cancel</button>
              <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
