import { useState, useMemo } from "react";
import {
  Bell,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import AddInternModal from "./AddInternModal";



const initialInterns = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@company.com",
    mentor: "Michael",
    attendance: "92%",
    performance: "Good",
    status: "Active",
    avatar: "https://photoswaly.in/wp-content/uploads/girl-photo_110.webp",
  },
  
  {
    id: 2,
    name: "Aman Verma",
    email: "aman@company.com",
    mentor: "James",
    attendance: "85%",
    performance: "Average",
    status: "Inactive",
    avatar: "https://png.pngtree.com/png-clipart/20240212/original/pngtree-kawai-anime-girl-vector-png-image_14296322.png",
  },
  {
    id: 3,
    name: "Neha Singh",
    email: "neha@company.com",
    mentor: "Lisa",
    attendance: "96%",
    performance: "Excellent",
    status: "Active",
    avatar: "",
  },
];

export default function InternsPage() {
  const [interns, setInterns] = useState(initialInterns);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [viewIntern, setViewIntern] = useState(null);
const ITEMS_PER_PAGE = 10;
const [open, setOpen] = useState(false);
const [editingIntern, setEditingIntern] = useState(null);

const [isOpen, setIsOpen] = useState(false); 


  const currentView = "interns";

  const filteredInterns = useMemo(() => {
    return interns.filter((i) => {
      if (filterStatus !== "All" && i.status !== filterStatus) return false;

      if (!search) return true;
      const s = search.toLowerCase();
      return (
        i.name.toLowerCase().includes(s) ||
        i.email.toLowerCase().includes(s) ||
        i.mentor.toLowerCase().includes(s)
      );
    });
  }, [interns, search, filterStatus]);

  
  const totalInternPages = Math.ceil(
    filteredInterns.length / ITEMS_PER_PAGE
  );

  const paginatedInterns = filteredInterns.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  
  const handleDelete = (id) => {
    setInterns(interns.filter((i) => i.id !== id));
  };

 
  const handleAdd = (intern) => {
    setInterns([...interns, { ...intern, id: Date.now() }]);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col">
     
      <div className="flex flex-col lg:flex-row border-b justify-between items-start lg:items-center py-[14px] px-4 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, Sarah. Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-700"
          >

            <Plus size={16} /> Add Intern
          </button>
 
          <Bell size={20} className="text-gray-400" />
          <div className="h-9 w-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            SI
          </div>
        </div>
      </div>

   
      <main className="p-6">
       
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
              <Filter size={18} />{" "}
              {filterStatus === "All" ? "Filter" : filterStatus}
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-xl shadow z-50">
                {["All", "Active", "Inactive"].map((s) => (
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

        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400">
              <tr>
                <th className="p-4 text-left">Intern Name</th>
                <th className="p-4 text-center">Mentor</th>
                <th className="p-4 text-center">Attendance</th>
                <th className="p-4 text-center">Performance</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

        <tbody className="divide-y">
  {paginatedInterns.map((i, index) => (
    <tr key={index} className="hover:bg-gray-50">
     
      <td className="p-4 flex items-center gap-3">
        <img
          src={i.avatar}
          alt={i.name}
          className="h-9 w-9 rounded-full object-cover bg-gray-200"
        />
        <div>
          <p className="font-semibold">{i.name}</p>
          <p className="text-xs text-gray-400">{i.email}</p>
        </div>
      </td>

      <td className="p-4 text-center">{i.mentor}</td>
      <td className="p-4 text-center">{i.attendance}</td>
      <td className="p-4 text-center">{i.performance}</td>

      <td className="p-4 text-center">
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
          {i.status || "Active"}
        </span>
      </td>

      <td className="p-4 text-center">
        <div className="flex justify-center gap-3">
          <Eye
            size={18}
            className="cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => setViewIntern(i)}
          />
        
        </div>
      </td>
    </tr>
  ))}
</tbody>

          </table>

        
          <div className="flex justify-between items-center p-4 text-sm">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="border px-4 py-1.5 rounded-lg disabled:text-gray-300"
            >
              Previous
            </button>

            <span>
              Page {page} of {totalInternPages}
            </span>

            <button
              disabled={page === totalInternPages}
              onClick={() => setPage((p) => p + 1)}
              className="border px-4 py-1.5 rounded-lg disabled:text-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </main>

    
      {viewIntern && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-3">
            <h2 className="font-bold text-lg">Intern Details</h2>

            <p><b>Name:</b> {viewIntern.name}</p>
            <p><b>Email:</b> {viewIntern.email}</p>
            <p><b>Mentor:</b> {viewIntern.mentor}</p>
            <p><b>Attendance:</b> {viewIntern.attendance}</p>
            <p><b>Performance:</b> {viewIntern.performance}</p>
            <p><b>Status:</b> {viewIntern.status}</p>

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

      
      {isOpen && (
        <AddInternModal
          onAdd={handleAdd}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

