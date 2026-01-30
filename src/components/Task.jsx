import {
  Bell, Plus, Search, Eye, Filter, Home, Users,
  List, FileText, Settings, LogOut, Edit, Trash2
} from "lucide-react";
import { useState } from "react";

function App() {
  // State to switch between Interns and Tasks view
  const [currentView, setCurrentView] = useState("tasks");


  const tasks = [
    { title: "UI Dashboard", assigned: "Aditi Shah", deadline: "Dec 12, 2025", createdBy: "Mentor", status: "Approved" },
    { title: "API Integration", assigned: "3 Interns", deadline: "Dec 12, 2024", createdBy: "Mentor", status: "Pending" },
    { title: "Testing Module", assigned: "Aman Verma", deadline: "Dec 12, 2024", createdBy: "Admin", status: "Rejected" },
    { title: "Documentation", assigned: "Anjali Verma", deadline: "Dec 12, 2024", createdBy: "Mentor", status: "Approved" },
    { title: "UI Dashboard", assigned: "Aditi Shah", deadline: "Dec 12, 2025", createdBy: "Mentor", status: "Approved" },
    { title: "API Integration", assigned: "3 Interns", deadline: "Dec 12, 2024", createdBy: "Mentor", status: "Pending" },
    { title: "Testing Module", assigned: "Aman Verma", deadline: "Dec 12, 2024", createdBy: "Admin", status: "Rejected" },

  ];

  const ITEMS_PER_PAGE = 8;
  const [page, setPage] = useState(1);
  const totalTaskPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);

  const paginatedTasks = tasks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );



  return (
    <div className="flex min-h-screen ">




      <div className="flex-1 flex flex-col">

        <div className="flex flex-col lg:flex-row border-b justify-between items-start lg:items-center py-[14px] px-4  gap-4">
          <div>
            <h1 className="text-lg sm:text-md font-semibold text-gray-800">
              Dashboard
            </h1>
            <p className="text-md  text-gray-500">
              Welcome back, Sarah. Here's what's happening today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4  w-full lg:w-auto">
            <div className="flex items-center gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-700 shadow-sm transition-all">
                <Plus size={16} /> {'Create Task'}
              </button>
              <Bell className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
              <div className="h-9 w-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold cursor-pointer">
                SI
              </div>
            </div>
          </div>
        </div>


        <main className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 flex-1 shadow-sm">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder={currentView === 'interns' ? "Search by name or department" : "Search by Mentor, Interns name..."}
                className="outline-none text-sm w-full bg-transparent"
              />
            </div>
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors text-gray-600">
              <Filter size={18} /> Filter
            </button>
          </div>


          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 font-medium">
                {currentView === 'interns' ? (
                  <tr>
                    <th className="p-4 text-left">Intern Name</th>
                    <th className="p-4 text-center">Mentor</th>
                    <th className="p-4 text-center">Attendance</th>
                    <th className="p-4 text-center">Performance</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="p-4 text-left font-semibold">Task Title</th>
                    <th className="p-4 text-left font-semibold">Assigned To</th>
                    <th className="p-4 text-left font-semibold">Deadline</th>
                    <th className="p-4 text-left font-semibold">Created By</th>
                    <th className="p-4 text-center font-semibold">Status</th>
                    <th className="p-4 text-center font-semibold">Action</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedTasks.map((t) => (
                  <tr key={t.title} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-700">{t.title}</td>
                    <td className="p-4 text-gray-600">{t.assigned}</td>
                    <td className="p-4 text-gray-600">{t.deadline}</td>
                    <td className="p-4 text-gray-600">{t.createdBy}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider 
                          ${t.status === 'Approved' ? 'bg-green-50 text-green-500' :
                          t.status === 'Pending' ? 'bg-yellow-50 text-yellow-500' :
                            'bg-red-50 text-red-400'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3 text-gray-400">
                        <Eye size={17} className="cursor-pointer hover:text-gray-600" />
                        <Edit size={17} className="cursor-pointer hover:text-blue-500" />
                        <Trash2 size={17} className="cursor-pointer hover:text-red-500" />
                      </div>
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center p-4 border-t border-gray-100 text-sm text-gray-500">

              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-4 py-1.5 rounded-lg font-medium transition-all
      ${page === 1
                    ? "border border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border border-orange-500 text-orange-500 hover:bg-orange-50"}`}
              >
                Previous
              </button>

              <span className="font-medium text-gray-600">
                Page {page} of {totalTaskPages}
              </span>


              <button
                disabled={
                  page === (totalTaskPages)
                }
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-4 py-1.5 rounded-lg font-medium transition-all
      ${page === (totalTaskPages)
                    ? "border border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border border-orange-500 text-orange-500 hover:bg-orange-50"}`}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
import React, { useContext, useMemo, useState } from 'react';
import { AppStateContext } from '../context/AppState';
import Modal from './Modal';
import ReusableTable from './ReusableTable';
import { Eye, Edit, Trash2 } from 'lucide-react';
import {
  Bell, Plus, Search, Filter, Home, Users,
  List, FileText, Settings, LogOut,
} from "lucide-react";

const Interns = () => {
  const { interns, mentors, addIntern, updateIntern, deleteIntern } = useContext(AppStateContext);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', mentorId: '', status: 'Active' });
  const [currentView, setCurrentView] = useState("tasks");
  const mentorsById = useMemo(() => Object.fromEntries(mentors.map((m) => [m.id, m])), [mentors]);

  const data = interns.filter((it) => {
    if (filter !== 'All' && it.status !== filter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return it.name.toLowerCase().includes(s) || it.email.toLowerCase().includes(s);
  });

  const ITEMS_PER_PAGE = 8;
  const [page, setPage] = useState(1);
  const totalInternPages = Math.ceil(interns.length / ITEMS_PER_PAGE);

  const paginatedInterns = interns.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );



  const handleOpenAdd = () => { setForm({ name: '', email: '', mentorId: '', status: 'Active' }); setEditing(null); setOpen(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) updateIntern(editing.id, { ...form, mentorId: form.mentorId ? Number(form.mentorId) : null });
    else addIntern({ ...form, mentorId: form.mentorId ? Number(form.mentorId) : null });
    setOpen(false);
  };

  return (
    <>

      <div className="flex min-h-screen bg-gray-100">
     
        <div className="flex-1 flex flex-col">
        
          <div className="flex flex-col lg:flex-row border-b justify-between items-start lg:items-center py-[14px] px-4  gap-4">
            <div>
              <h1 className="text-lg sm:text-md font-semibold text-gray-800">
                Dashboard
              </h1>
              <p className="text-md  text-gray-500">
                Welcome back, Sarah. Here's what's happening today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4  w-full lg:w-auto">
              <div className="flex items-center gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-700 shadow-sm transition-all">
                  <Plus size={16} /> {'Add Intern'}
                </button>
                <Bell className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
                <div className="h-9 w-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold cursor-pointer">
                  SI
                </div>
              </div>
            </div>
          </div>

         
          <main className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 flex-1 shadow-sm">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder={currentView === 'interns' ? "Search by name or department" : "Search by Mentor, Interns name..."}
                  className="outline-none text-sm w-full bg-transparent"
                />
              </div>
              <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors text-gray-600">
                <Filter size={18} /> Filter
              </button>
            </div>
          </main>

        </div>
      </div>
    </>

  );
};
