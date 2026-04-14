import React from 'react';
import { Plus, CheckSquare, Bell, Eye, Users, Edit, UserPlus, UserCheck, ClipboardList, Award, GraduationCap, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useContext, useEffect } from "react";
import { AppStateContext } from '../context/AppState';

import AddInternModal from './AddInternModal';
import AddMentorModal from './AddMentorModal';

const chartData = [
  { name: 'Mon', attendance: 75 },
  { name: 'Tue', attendance: 55 },
  { name: 'Wed', attendance: 65 },
  { name: 'Thu', attendance: 100 },
  { name: 'Fri', attendance: 80 },
  { name: 'Sat', attendance: 85 },
  { name: 'Sun', attendance: 60 },
];

const App = ({email}) => {
const { addIntern, addMentor } = useContext(AppStateContext);
  // ✅ backend states
  const [interns, setInterns] = useState([]);
  const [mentors, setMentors] = useState([]);
  const name = localStorage.getItem("name"); //chngable
  const [openInternModal, setOpenInternModal] = useState(false);
  const [openMentorModal, setOpenMentorModal] = useState(false);

  // ✅ fetch both APIs
  useEffect(() => {
    fetchInterns();
    fetchMentors();
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

  const fetchMentors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/mentors");
      const data = await res.json();
      setMentors(data);
    } catch (err) {
      console.error("Error fetching mentors", err);
    }
  };

  // ✅ latest 2 interns
  const recentInterns = [...interns]
    .sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))
    .slice(0, 2);

  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Poppins, sans-serif' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
    content: { padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
    card: { backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.main}>

        {/* NAVBAR */}
        <div className="flex flex-col lg:flex-row border-b justify-between items-start lg:items-center py-[14px] px-4 gap-4 bg-white">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
            <p className="text-md text-gray-500">Welcome back, {email}.</p>
          </div>

          <div className="flex items-center gap-4">
            <Bell className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
            <div className="h-9 w-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              <p>{email.substring(0, 2)}</p>
            </div>
          </div>
        </div>

        <main style={styles.content}>

          {/* STATS */}
          <div style={styles.statsGrid}>
            <StatCard icon={<Users color="#3b82f6" />} label="Total Interns" value={interns.length} bg="#eff6ff" />
            <StatCard icon={<UserCheck color="#f97316" />} label="Present Today" value="92" bg="#fff7ed" />
            <StatCard icon={<Award color="#22c55e" />} label="Certificates Issued" value="65" bg="#f0fdf4" />
            <StatCard icon={<GraduationCap color="#f59e0b" />} label="Active Mentors" value={mentors.length} bg="#fffbeb" />
          </div>

          {/* CHART */}
          <div style={styles.card}>
            <h3 className="mb-5 font-semibold">Attendance Trend</h3>

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

                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorAttend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">

              <h3 className="p-5 font-semibold text-slate-800">
                Recent Activity
              </h3>

              <table className="w-full text-sm">
                <thead className="text-slate-400 border-b">
                  <tr>
                    <th className="text-left px-5 py-3">INTERN NAME</th>
                    <th className="text-center py-3">MENTOR</th>
                    <th className="text-center py-3">STATUS</th>
                    <th className="text-center py-3">ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  {recentInterns.map((intern) => (

                    <tr key={intern._id} className="border-t hover:bg-slate-50">

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-200 rounded-full" />
                          <div>
                            <p className="font-semibold text-slate-700">{intern.name}</p>
                            <p className="text-xs text-slate-400">{intern.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="text-center">
                        {intern.mentor || "-"}
                      </td>

                      <td className="text-center">
                        <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                          {intern.status}
                        </span>
                      </td>

                      <td className="text-center">
                        <div className="flex justify-center gap-4 text-slate-400">
                          <Eye size={16} className="cursor-pointer hover:text-slate-600" />
                          <Edit size={16} className="cursor-pointer hover:text-blue-500" />
                          <Trash2 size={16} className="cursor-pointer hover:text-red-500" />
                        </div>
                      </td>

                    </tr>

                  ))}

                </tbody>
              </table>

            </div>

            {/* QUICK ACTION */}
            <div className="bg-white rounded-2xl border p-5 shadow-sm h-fit">
              <h3 className="font-semibold mb-5">Quick Action</h3>

              <div className="space-y-3">
                <ActionBtn onClick={() => setOpenInternModal(true)} icon={<UserPlus size={18} />} text="Add Intern" />
                <ActionBtn onClick={() => setOpenMentorModal(true)} icon={<UserPlus size={18} />} text="Add Mentor" />
                <ActionBtn icon={<Award size={18} />} text="Generate Certificate" />
              </div>
            </div>

          </div>

        </main>

        {/* MODALS */}
        {openInternModal && (
          <AddInternModal
            onAdd={(intern) => {
              addIntern(intern);
              fetchInterns();
              setOpenInternModal(false);
            }}
            onClose={() => setOpenInternModal(false)}
          />
        )}

        {openMentorModal && (
          <AddMentorModal
            onAdd={(mentor) => {
              addMentor(mentor);
              fetchMentors(); // ✅ refresh mentors
              setOpenMentorModal(false);
            }}
            onClose={() => setOpenMentorModal(false)}
          />
        )}

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

export default App;