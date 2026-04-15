"use client";

import React, { useState, useEffect } from "react";
import { User, Calendar, Mail, UserCheck, CheckCircle2, Clock, PlayCircle, ClipboardList } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard({ iemail }) {
  const [internData, setInternData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Intern Profile Details
        const internRes = await fetch("http://localhost:5000/api/interns");
        const interns = await internRes.json();
        const currentIntern = interns.find(
          (i) => i.email?.toLowerCase().trim() === iemail?.toLowerCase().trim()
        );
        setInternData(currentIntern);

        // 2. Fetch Tasks for Chart
        const taskRes = await fetch("http://localhost:5000/api/tasks");
        const allTasks = await taskRes.json();
        
        // Filter tasks belonging to this intern
        const internTasks = allTasks.filter(t => {
            const internId = typeof t.internId === "object" ? t.internId?._id : t.internId;
            return internId === currentIntern?._id;
        });
        setTasks(internTasks);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };

    if (iemail) fetchData();
  }, [iemail]);

  // Prepare data for the Chart
  const chartData = [
    { name: 'Pending', count: tasks.filter(t => t.status === 'Pending').length, color: '#f97316' },
    { name: 'Active', count: tasks.filter(t => t.status === 'Active').length, color: '#3b82f6' },
    { name: 'Review', count: tasks.filter(t => t.status === 'Reviewing').length, color: '#8b5cf6' },
    { name: 'Done', count: tasks.filter(t => t.status === 'Completed').length, color: '#22c55e' },
  ];

  if (loading) return <div className="p-8 text-center font-[Poppins]">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins]">
      {/* NAVBAR */}
      <div className="flex justify-between items-center border-b px-6 py-4 bg-white shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F2A5B]">Dashboard</h1>
          <p className="text-xs text-gray-500">Welcome back, {internData?.name || iemail}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                {iemail?.substring(0, 2).toUpperCase()}
            </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. INTERN PROFILE CARD */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-[#1F2A5B] px-6 py-4 flex items-center justify-between">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <User size={18} /> Intern Profile Details
            </h2>
            <span className="text-[10px] bg-blue-500/20 text-blue-100 px-2 py-1 rounded uppercase tracking-widest font-bold">Official</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {/* 1st Card: Intern Name */}
            <InfoBox 
                label="Intern Name" 
                value={internData?.name} 
                icon={<UserCheck className="text-blue-500" />} 
            />

            {/* 2nd Card: Intern Email */}
            <InfoBox 
                label="Intern Email" 
                value={internData?.email || iemail} 
                icon={<Mail className="text-blue-500" />} 
            />

            {/* 3rd Card: Joining Date */}
            <InfoBox 
                label="Joining Date" 
                value={internData?.joinedDate ? new Date(internData.joinedDate).toLocaleDateString() : "N/A"} 
                icon={<Calendar className="text-orange-500" />} 
            />
            
            {/* 4th Card: Assigned Mentor */}
            <InfoBox 
                label="Assigned Mentor" 
                value={internData?.mentorName || internData?.mentor || "Not Assigned"} 
                icon={<PlayCircle className="text-purple-500" />} 
            />
          </div>
        </div>

        {/* 2. TASK ANALYTICS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#1F2A5B] mb-6">Task Performance Graph</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Summary Metrics */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#1F2A5B] mb-4">Task Breakdown</h3>
            <StatItem label="Total Tasks" count={tasks.length} color="bg-gray-100 text-gray-700" icon={<ClipboardList size={16}/>} />
            <StatItem label="Completed" count={chartData[3].count} color="bg-green-100 text-green-700" icon={<CheckCircle2 size={16}/>} />
            <StatItem label="Active" count={chartData[1].count} color="bg-blue-100 text-blue-700" icon={<PlayCircle size={16}/>} />
            <StatItem label="Pending" count={chartData[0].count} color="bg-orange-100 text-orange-700" icon={<Clock size={16}/>} />
            
            <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-[11px] text-orange-600 font-bold uppercase tracking-wider">Quick Note</p>
                <p className="text-xs text-orange-800 mt-1 italic">
                    {internData?.mentorNote || "Consistency is key! Aim to move your 'Pending' tasks to 'Completed' by the weekend."}
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Profile Info items
function InfoBox({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-700 break-all">{value || "---"}</p>
      </div>
    </div>
  );
}

// Sub-component for Task Summary items
function StatItem({ label, count, color, icon }) {
    return (
        <div className="flex items-center justify-between p-3 border border-gray-50 rounded-xl bg-gray-50/30">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
                <span className="text-sm font-medium text-gray-600">{label}</span>
            </div>
            <span className="text-lg font-bold text-[#1F2A5B]">{count}</span>
        </div>
    );
}