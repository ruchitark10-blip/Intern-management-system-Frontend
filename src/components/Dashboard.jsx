import React, { useState, useContext, useEffect } from 'react';
import { 
  Eye, Users, UserPlus, GraduationCap, Trash2 
} from 'lucide-react';
import { AppStateContext } from '../context/AppState';

import AddInternModal from './AddInternModal';
import AddMentorModal from './AddMentorModal';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// initials
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
  const [attendance, setAttendance] = useState([]);

  const name = localStorage.getItem("name");

  const [openInternModal, setOpenInternModal] = useState(false);
  const [openMentorModal, setOpenMentorModal] = useState(false);
  const [viewIntern, setViewIntern] = useState(null);

  useEffect(() => {
    fetchInterns();
    fetchMentors();
    fetchAttendance();
  }, []);

  const fetchInterns = async () => {
    const res = await fetch("http://localhost:5000/api/interns");
    const data = await res.json();
    setInterns(Array.isArray(data) ? data : []);
  };

  const fetchMentors = async () => {
    const res = await fetch("http://localhost:5000/api/mentors");
    const data = await res.json();
    setMentors(Array.isArray(data) ? data : []);
  };

  const fetchAttendance = async () => {
    const res = await fetch("http://localhost:5000/api/attendance");
    const data = await res.json();
    setAttendance(Array.isArray(data) ? data : []);
  };

  // ✅ MON–SAT WEEKLY DATA
  const getWeeklyData = () => {
    const result = [];

    const today = new Date();
    const currentDay = today.getDay();

    const monday = new Date(today);
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    monday.setDate(today.getDate() + diff);

    for (let i = 0; i < 6; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const dateStr = d.toISOString().split("T")[0];

      const present = attendance.filter(
        (a) =>
          new Date(a.date).toISOString().split("T")[0] === dateStr &&
          a.checkIn
      ).length;

      result.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        present,
      });
    }

    return result;
  };

  const weeklyData = getWeeklyData();

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this intern?")) return;

    await fetch(`http://localhost:5000/api/interns/${id}`, {
      method: "DELETE",
    });

    setInterns((prev) => prev.filter((i) => i._id !== id));
  };

  const recentInterns = [...interns]
    .filter(i => i.joinedDate)
    .sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {email}</p>
        </div>

        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold shadow">
          {getInitials(name || email)}
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard icon={<Users size={20} />} label="Total Interns" value={interns.length} color="blue" />
          <StatCard icon={<GraduationCap size={20} />} label="Mentors" value={mentors.length} color="orange" />
        </div>

        {/* 🎨 CHART */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border overflow-hidden">
          <h3 className="p-5 font-semibold text-white bg-gradient-to-r from-blue-900 to-indigo-900">
            Weekly Attendance 
          </h3>

          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis allowDecimals={false} stroke="#6b7280" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                  }}
                />

                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>

                <Bar
                  dataKey="present"
                  fill="url(#colorBar)"
                  radius={[10, 10, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLE + ACTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* TABLE */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border overflow-hidden">
            <h3 className="p-5 font-semibold text-white bg-gradient-to-r from-blue-900 to-indigo-900">
              Recent Activity
            </h3>

            <table className="w-full text-sm">
              <tbody>
                {recentInterns.map((intern) => (
                  <tr key={intern._id} className="hover:bg-gray-50 transition">

                    <td className="p-4 font-medium text-gray-700">
                      {intern.name}
                    </td>

                    <td className="text-center text-gray-500">
                      {intern.mentor || "-"}
                    </td>

                    <td className="text-center">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                        {intern.status}
                      </span>
                    </td>

                    <td className="text-center">
                      <div className="flex justify-center gap-3 text-gray-400">
                        <Eye
                          size={16}
                          className="cursor-pointer hover:text-blue-500"
                          onClick={() => setViewIntern(intern)}
                        />
                        <Trash2
                          size={16}
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => handleDelete(intern._id)}
                        />
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ACTION */}
          <div className="bg-white rounded-2xl shadow-md border p-5">
            <h3 className="font-semibold text-gray-700 mb-4">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <ActionBtn text="Add Intern" onClick={() => setOpenInternModal(true)} />
              <ActionBtn text="Add Mentor" onClick={() => setOpenMentorModal(true)} />
            </div>
          </div>

        </div>
      </div>

      {/* MODAL */}
      {viewIntern && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="font-semibold mb-4 text-lg">Intern Details</h2>

            <p><b>Name:</b> {viewIntern.name}</p>
            <p><b>Email:</b> {viewIntern.email}</p>
            <p>
              <b>Joined:</b>{" "}
              {viewIntern.joinedDate
                ? new Date(viewIntern.joinedDate).toLocaleDateString()
                : "-"}
            </p>

            <button
              onClick={() => setViewIntern(null)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {openInternModal && (
        <AddInternModal onAdd={fetchInterns} onClose={() => setOpenInternModal(false)} />
      )}

      {openMentorModal && (
        <AddMentorModal onAdd={fetchMentors} onClose={() => setOpenMentorModal(false)} />
      )}

    </div>
  );
};

const ActionBtn = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:scale-105 transition"
  >
    {text}
  </button>
);

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: "from-blue-500 to-indigo-500",
    orange: "from-orange-400 to-yellow-400",
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-lg transition">
      <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r ${colors[color]} text-white mb-3`}>
        {icon}
      </div>

      <p className="text-sm text-gray-500">{label}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
  );
};

export default App;