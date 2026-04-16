import React, { useState, useContext, useEffect } from 'react';
import { 
  Eye, Users, Edit, UserPlus, GraduationCap, Trash2 
} from 'lucide-react';
import { AppStateContext } from '../context/AppState';

import AddInternModal from './AddInternModal';
import AddMentorModal from './AddMentorModal';

// ✅ initials function
const getInitials = (text) => {
  if (!text) return "";
  const words = text.trim().split(" ");
  return words.length === 1
    ? words[0].slice(0, 2).toUpperCase()
    : (words[0][0] + words[1][0]).toUpperCase();
};

const App = ({ email }) => {
  const { addIntern, addMentor } = useContext(AppStateContext);

  const [interns, setInterns] = useState([]);
  const [mentors, setMentors] = useState([]);
  const name = localStorage.getItem("name");

  const [openInternModal, setOpenInternModal] = useState(false);
  const [openMentorModal, setOpenMentorModal] = useState(false);

  useEffect(() => {
    fetchInterns();
    fetchMentors();
  }, []);

  const fetchInterns = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/interns");
      const data = await res.json();
      setInterns(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching interns", err);
      setInterns([]);
    }
  };

  const fetchMentors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/mentors");
      const data = await res.json();
      setMentors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching mentors", err);
      setMentors([]);
    }
  };

  const recentInterns = [...interns]
    .filter(i => i.joinedDate)
    .sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))
    .slice(0, 2);

  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Poppins, sans-serif' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
    content: { padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' },

    // ✅ UPDATED GRID (2 columns full width)
    statsGrid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gap: '20px' 
    },
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
            <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
              {getInitials(name || email) || "U"}
            </div>
          </div>
        </div>

        <main style={styles.content}>

          {/* STATS */}
          <div style={styles.statsGrid}>
            <StatCard 
              icon={<Users color="#3b82f6" />} 
              label="Total Interns" 
              value={interns.length} 
              bg="#eff6ff" 
            />

            <StatCard 
              icon={<GraduationCap color="#f59e0b" />} 
              label="Active Mentors" 
              value={mentors.length} 
              bg="#fffbeb" 
            />
          </div>

          {/* TABLE + ACTION */}
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
                  {recentInterns.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-gray-400">
                        No recent activity
                      </td>
                    </tr>
                  ) : (
                    recentInterns.map((intern) => (
                      <tr key={intern._id} className="border-t hover:bg-slate-50">

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                              {getInitials(intern.name)}
                            </div>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* QUICK ACTION */}
            <div className="bg-white rounded-2xl border p-5 shadow-sm h-fit">
              <h3 className="font-semibold mb-5">Quick Action</h3>

              <div className="space-y-3">
                <ActionBtn onClick={() => setOpenInternModal(true)} icon={<UserPlus size={18} />} text="Add Intern" />
                <ActionBtn onClick={() => setOpenMentorModal(true)} icon={<UserPlus size={18} />} text="Add Mentor" />
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
              fetchMentors();
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