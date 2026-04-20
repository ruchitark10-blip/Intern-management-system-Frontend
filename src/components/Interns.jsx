"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Filter, Eye, Trash2, MoreVertical, CheckCircle } from "lucide-react";
import AddInternModal from "./AddInternModal";

export default function InternsPage() {
  const [interns, setInterns] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [viewIntern, setViewIntern] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openMentorDropdown, setOpenMentorDropdown] = useState(null);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchInterns();
    fetchMentors();
  }, []);

  const fetchInterns = async () => {
    try {
      const res = await fetch("https://intern-management-system-backend-za7h.onrender.com/api/interns");
      const data = await res.json();
      setInterns(data);
    } catch (err) {
      console.error("Error fetching interns", err);
    }
  };

  const fetchMentors = async () => {
    try {
      const res = await fetch("https://intern-management-system-backend-za7h.onrender.com/api/mentors");
      const data = await res.json();
      setMentors(data);
    } catch (err) {
      console.error("Error fetching mentors", err);
    }
  };

  const handleCertificateApprove = async (id) => {
    try {
      await fetch(`https://intern-management-system-backend-za7h.onrender.com/api/interns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificate: true }),
      });

      setInterns((prev) =>
        prev.map((i) =>
          i._id === id ? { ...i, certificate: true } : i
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredInterns = useMemo(() => {
    return interns.filter((i) => {
      if (filterStatus !== "All" && i.status !== filterStatus) return false;

      const s = search.toLowerCase();

      return (
        i.name?.toLowerCase().includes(s) ||
        i.email?.toLowerCase().includes(s) ||
        i.mentor?.toLowerCase().includes(s)
      );
    });
  }, [interns, search, filterStatus]);

  const paginatedInterns = filteredInterns.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure?");
    if (!confirmed) return;

    await fetch(`https://intern-management-system-backend-za7h.onrender.com/api/interns/${id}`, {
      method: "DELETE",
    });

    setInterns((prev) => prev.filter((i) => i._id !== id));
  };

  const handleStatusChange = async (id, newStatus) => {
    setInterns((prev) =>
      prev.map((i) => (i._id === id ? { ...i, status: newStatus } : i))
    );

    await fetch(`https://intern-management-system-backend-za7h.onrender.com/api/interns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const handleMentorChange = async (internId, newMentor) => {
    setInterns((prev) =>
      prev.map((i) =>
        i._id === internId ? { ...i, mentor: newMentor } : i
      )
    );

    await fetch(`https://intern-management-system-backend-za7h.onrender.com/api/interns/${internId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentor: newMentor }),
    });
  };

  return (
    <div className="flex-1 flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-lg font-semibold">Interns</h1>

        <button
          onClick={() => setIsOpen(true)}
           className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={18} /> Add Intern
        </button>
      </div>
      

      <main className="p-6">

        {/* SEARCH */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center border px-3 py-2 rounded w-full">
            <Search size={18} />
            <input
              className="ml-2 w-full outline-none"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-400">
              <tr>
                <th className="p-4 text-left">Intern</th>
                <th className="p-4 text-left">Joined</th>
                <th className="p-4 text-left">Duration</th>
                <th className="p-4 text-left">Certificate</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedInterns.map((i) => (
                <tr key={i._id} className="border-t">

                  {/* INTERN */}
                  <td className="p-4">
                    <p className="font-semibold">{i.name}</p>
                    <p className="text-xs text-gray-400">{i.email}</p>

                    <select
                      value={i.status}
                      onChange={(e) =>
                        handleStatusChange(i._id, e.target.value)
                      }
                      className={`text-xs border mt-1 px-2 py-1 rounded font-semibold
                        ${i.status === "Active" ? "text-green-600 bg-green-50 border-green-200" : ""}
                        ${i.status === "Inactive" ? "text-red-600 bg-red-50 border-red-200" : ""}
                        ${i.status === "Completed" ? "text-blue-600 bg-blue-50 border-blue-200" : ""}
                      `}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  {/* JOINED */}
                  <td className="p-4">
                    {new Date(i.joinedDate).toLocaleDateString()}
                  </td>

                  {/* DURATION */}
                  <td className="p-4 text-blue-600 font-semibold">
                    {i.duration ? `${i.duration} Months` : "-"}
                  </td>

                  {/* CERTIFICATE */}
                  <td className="p-4">
                    {i.certificate ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle size={14} /> Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCertificateApprove(i._id)}
                        className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                      >
                        Approve
                      </button>
                    )}
                  </td>

                  {/* ACTION (MENTOR DROPDOWN ADDED HERE) */}
                  <td className="p-4 text-center flex justify-center gap-3">

                    <Eye
                      className="cursor-pointer"
                      onClick={() => setViewIntern(i)}
                    />

                    <Trash2
                      className="cursor-pointer text-red-500"
                      onClick={() => handleDelete(i._id)}
                    />

                    {/* MENTOR DROPDOWN */}
                    <div className="relative">

                      <MoreVertical
                        className="cursor-pointer"
                        onClick={() =>
                          setOpenMentorDropdown(
                            openMentorDropdown === i._id ? null : i._id
                          )
                        }
                      />

                      {openMentorDropdown === i._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow z-50 p-2">

                          <div className="text-xs text-gray-500 mb-1 px-2">
                            Current Mentor
                          </div>

                          <div className="px-2 py-1 text-sm font-medium bg-gray-100 rounded mb-2">
                            {i.mentor || "Not Assigned"}
                          </div>

                          <div className="text-xs text-gray-500 mb-1 px-2">
                            Assign Mentor
                          </div>

                          {mentors
                            .filter((m) => m.name !== i.mentor)
                            .map((m) => (
                              <div
                                key={m._id}
                                onClick={() => {
                                  handleMentorChange(i._id, m.name);
                                  setOpenMentorDropdown(null);
                                }}
                                className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer rounded"
                              >
                                {m.name}
                              </div>
                            ))}

                        </div>
                      )}

                    </div>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </main>

      {/* VIEW MODAL */}
      {viewIntern && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="font-bold text-lg mb-3">Intern Details</h2>

            <p><b>Name:</b> {viewIntern.name}</p>
            <p><b>Email:</b> {viewIntern.email}</p>
            <p><b>Status:</b> {viewIntern.status}</p>
            <p><b>Certificate:</b> {viewIntern.certificate ? "Approved" : "Pending"}</p>

            <div className="text-right mt-4">
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

      {/* ADD MODAL */}
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