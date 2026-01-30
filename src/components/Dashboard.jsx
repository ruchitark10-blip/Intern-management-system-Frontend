import React from 'react';
import { Plus,} from "lucide-react";
import { CheckSquare, Bell, Eye,Users, Edit,UserPlus, UserCheck, ClipboardList, Award, GraduationCap, ChevronDown
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

import { useState, useContext } from "react";

import { Trash2} from "lucide-react";


const chartData = [
  { name: 'Mon', attendance: 75 },
  { name: 'Tue', attendance: 55 },
  { name: 'Wed', attendance: 65 },
  { name: 'Thu', attendance: 100 },
  { name: 'Fri', attendance: 80 },
  { name: 'Sat', attendance: 85 },
  { name: 'Sun', attendance: 60 },
];

import { AppStateContext } from '../context/AppState';
import Modal from './Modal';
const App = () => {
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' },
    sidebar: { width: '260px', backgroundColor: '#0f172a', color: '#94a3b8', display: 'flex', flexDirection: 'column', padding: '24px 0' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
    header: { height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' },
    content: { padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' },
    card: { backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    sectionGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' },
    navItem: (active) => ({
      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', cursor: 'pointer',
      background: active ? 'linear-gradient(90deg, #f97316, #fb923c)' : 'transparent',
      color: active ? 'white' : '#94a3b8', borderRadius: active ? '0 50px 50px 0' : '0',
      marginRight: active ? '20px' : '0'
    }),
    statusBadge: { padding: '4px 12px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    actionBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: 'white', cursor: 'pointer', fontWeight: '600', color: '#475569' }
  };

  const { interns, mentors, tasks, addIntern, addMentor, addTask, updateIntern, deleteIntern } = useContext(AppStateContext);
  const [selectedIntern, setSelectedIntern] = useState(null);

  const [openInternModal, setOpenInternModal] = useState(false);
  const [openMentorModal, setOpenMentorModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);

  const [internForm, setInternForm] = useState({ name: '', email: '', mentorId: '' });
  const [mentorForm, setMentorForm] = useState({ name: '', email: '', team: '' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assigneeType: 'intern', assigneeId: '' });

 
  const handleView = (intern) => {
    setSelectedIntern(intern);
  };

  const [editingInternId, setEditingInternId] = useState(null);

  const submitAddIntern = (e) => {
    e.preventDefault();
    const payload = { name: internForm.name, email: internForm.email, mentorId: internForm.mentorId ? Number(internForm.mentorId) : null, status: 'Active' };
    if (editingInternId) {
      updateIntern(editingInternId, payload);
      setEditingInternId(null);
    } else {
      addIntern(payload);
    }
    setInternForm({ name: '', email: '', mentorId: '' });
    setOpenInternModal(false);
  };

  const submitAddMentor = (e) => {
    e.preventDefault();
    addMentor(mentorForm);
    setOpenMentorModal(false);
  };

  const submitAddTask = (e) => {
    e.preventDefault();
    addTask({ title: taskForm.title, description: taskForm.description, assigneeType: taskForm.assigneeType, assigneeId: taskForm.assigneeId ? Number(taskForm.assigneeId) : null, status: 'Open' });
    setOpenTaskModal(false);
  };
  const handleEdit = (id) => {
    const it = interns.find((x) => x.id === id);
    if (!it) return;
    setInternForm({ name: it.name || '', email: it.email || '', mentorId: it.mentorId ? String(it.mentorId) : '' });
    setEditingInternId(id);
    setOpenInternModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this intern?')) deleteIntern(id);
  };

  return (
    <div style={styles.container}>

      {/* MAIN */}
      <div style={styles.main}>
         <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
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
           
            <Bell className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
            <div className="h-9 w-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold cursor-pointer">
              SI
            </div>
            </div>
          </div>
        </div>
</div>
        <main style={styles.content}>
        
          <div style={styles.statsGrid}>
            <StatCard icon={<Users color="#3b82f6" />} label="Total Interns" value="120" bg="#eff6ff" />
            <StatCard icon={<UserCheck color="#f97316" />} label="Present Today" value="92" bg="#fff7ed" />
            <StatCard icon={<ClipboardList color="#a855f7" />} label="Pending Task" value="18" bg="#faf5ff" />
            <StatCard icon={<Award color="#22c55e" />} label="Certificates Issued" value="65" bg="#f0fdf4" />
            <StatCard icon={<GraduationCap color="#f59e0b" />} label="Active Mentors" value="16" bg="#fffbeb" />
          </div>

      
          <div style={styles.sectionGrid}>
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Attendance Trend</h3>
                <select style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px', fontSize: '12px' }}>
                  <option>Last Week</option>
                </select>
              </div>
              <div style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} fill="url(#colorAttend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={{ marginBottom: '30px' }}>Task Completion</h3>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '6px solid #22c55e', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', fontWeight: 'bold' }}>70%</div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>Completed</p>
                </div>
                <div>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '6px solid #fb923c', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', fontWeight: 'bold' }}>30%</div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>Pending</p>
                </div>
              </div>
            </div>
          </div>

         
        <div className="grid grid-cols-3 gap-6">
     
      <div className="col-span-2 bg-white rounded-2xl border shadow-sm">
        <h3 className="p-5 font-semibold text-slate-800">Recent Activity</h3>

        <table className="w-full text-sm">
          <thead className="text-slate-400 border-b">
            <tr>
              <th className="text-left px-5 pb-3">INTERN NAME</th>
              <th className="pb-3">MENTOR</th>
              <th className="pb-3">STATUS</th>
              <th className="pb-3 text-center">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {interns.map((intern) => (
              <tr key={intern.id} className="border-t hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-200 rounded-full" />
                    <div>
                      <p className="font-semibold text-slate-700">{intern.name}</p>
                      <p className="text-xs text-slate-400">{intern.email}</p>
                    </div>
                  </div>
                </td>

                <td className="text-center">{mentors.find((m) => m.id === intern.mentorId)?.name || '-'}</td>

                <td className="text-center">
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                    {intern.status}
                  </span>
                </td>

                <td className="text-center">
                  <div className="flex justify-center gap-4 text-slate-400">
                    <Eye
                      size={16}
                      className="cursor-pointer hover:text-slate-600"
                      onClick={() => handleView(intern)}
                    />
                    <Edit
                      size={16}
                      className="cursor-pointer hover:text-blue-500"
                      onClick={() => handleEdit(intern.id)}
                    />
                    <Trash2
                      size={16}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => handleDelete(intern.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   
      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <h3 className="font-semibold mb-5">Quick Action</h3>
 {/* <button onClick={() => setOpenInternModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-700 shadow-sm transition-all">
              <Plus size={16} /> {'Add Intern' }
            </button>
            <button onClick={() => setOpenMentorModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-green-700 shadow-sm transition-all">
              <Plus size={16} /> {'Add Mentor' }
            </button>
            <button onClick={() => setOpenTaskModal(true)} className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-orange-600 shadow-sm transition-all">
              <Plus size={16} /> {'Assign Task' }
            </button> */}
        <div className="space-y-3">
          <ActionBtn onClick={() => setOpenInternModal(true)} icon={<UserPlus size={18} />} text={'Add Intern'} />
          <ActionBtn onClick={() => setOpenMentorModal(true)} icon={<UserPlus size={18} />} text="Add Mentor" />
          <ActionBtn onClick={() => setOpenTaskModal(true)} icon={<CheckSquare size={18} />} text="Assign Task" />
          <ActionBtn onClick={() => setOpenMentorModal(true)} icon={<Award size={18} />} text="Generate Certificate" />
        </div>
      </div>


      {selectedIntern && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[350px]">
            <h3 className="font-semibold mb-3">Intern Details</h3>
            <p><b>Name:</b> {selectedIntern.name}</p>
            <p><b>Email:</b> {selectedIntern.email}</p>
            <p><b>Mentor:</b> {mentors.find((m) => m.id === selectedIntern.mentorId)?.name || '-'}</p>

            <button
              onClick={() => setSelectedIntern(null)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <Modal open={openInternModal} onClose={() => setOpenInternModal(false)} title={editingInternId ? "Edit Intern" : "Add Intern"}>
        <form onSubmit={submitAddIntern} className="space-y-3">
          <input required value={internForm.name} onChange={(e) => setInternForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="w-full border px-3 py-2 rounded-md" />
          <input required value={internForm.email} onChange={(e) => setInternForm((s) => ({ ...s, email: e.target.value }))} placeholder="Email" className="w-full border px-3 py-2 rounded-md" />
          <select value={internForm.mentorId} onChange={(e) => setInternForm((s) => ({ ...s, mentorId: e.target.value }))} className="w-full border px-3 py-2 rounded-md">
            <option value="">Unassigned</option>
            {mentors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <div className="flex justify-end">
            <button onClick={() => setOpenInternModal(false)} type="button" className="mr-2 px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Add</button>
          </div>
        </form>
      </Modal>

      <Modal open={openMentorModal} onClose={() => setOpenMentorModal(false)} title="Add Mentor">
        <form onSubmit={submitAddMentor} className="space-y-3">
          <input required value={mentorForm.name} onChange={(e) => setMentorForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="w-full border px-3 py-2 rounded-md" />
          <input required value={mentorForm.email} onChange={(e) => setMentorForm((s) => ({ ...s, email: e.target.value }))} placeholder="Email" className="w-full border px-3 py-2 rounded-md" />
          <input value={mentorForm.team} onChange={(e) => setMentorForm((s) => ({ ...s, team: e.target.value }))} placeholder="Team" className="w-full border px-3 py-2 rounded-md" />
          <div className="flex justify-end">
            <button onClick={() => setOpenMentorModal(false)} type="button" className="mr-2 px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Add</button>
          </div>
        </form>
      </Modal>


      <Modal open={openTaskModal} onClose={() => setOpenTaskModal(false)} title="Assign Task">
        <form onSubmit={submitAddTask} className="space-y-3">
          <input required value={taskForm.title} onChange={(e) => setTaskForm((s) => ({ ...s, title: e.target.value }))} placeholder="Title" className="w-full border px-3 py-2 rounded-md" />
          <textarea value={taskForm.description} onChange={(e) => setTaskForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" className="w-full border px-3 py-2 rounded-md" />
          <div className="flex gap-2">
            <select value={taskForm.assigneeType} onChange={(e) => setTaskForm((s) => ({ ...s, assigneeType: e.target.value }))} className="border px-3 py-2 rounded-md">
              <option value="intern">Intern</option>
              <option value="mentor">Mentor</option>
            </select>
            <select value={taskForm.assigneeId} onChange={(e) => setTaskForm((s) => ({ ...s, assigneeId: e.target.value }))} className="border px-3 py-2 rounded-md flex-1">
              <option value="">Select</option>
              {taskForm.assigneeType === 'intern' ? interns.map((i) => <option key={i.id} value={i.id}>{i.name}</option>) : mentors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end">
            <button onClick={() => setOpenTaskModal(false)} type="button" className="mr-2 px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-md">Assign</button>
          </div>
        </form>
      </Modal>
    </div>
        </main>
      </div>
    </div>
  );
};

const ActionBtn = ({ icon, text, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-center gap-3 border rounded-xl py-3 font-semibold text-slate-600 hover:bg-slate-50">
    {icon} {text}
  </button>
);

const StatCard = ({ icon, label, value, bg }) => (
  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
    <div style={{ width: '40px', height: '40px', backgroundColor: bg, borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
      {icon}
    </div>
    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{label}</p>
    <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>{value}</p>
  </div>
);

const TableRow = ({ name, email, mentor }) => (
  <tr style={{ borderBottom: '1px solid #f8fafc' }}>
    <td style={{ padding: '15px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '35px', height: '35px', backgroundColor: '#e2e8f0', borderRadius: '50%' }}></div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{name}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{email}</div>
        </div>
      </div>
    </td>
    <td style={{ fontSize: '14px' }}>{mentor}</td>
    <td><span style={{ padding: '4px 12px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>Active</span></td>
    <td>
      <div style={{ display: 'flex', gap: '10px', color: '#94a3b8' }}>
        <Eye size={16} cursor="pointer" />
        <Edit size={16} cursor="pointer" />
      </div>
    </td>
  </tr>
);

export default App;