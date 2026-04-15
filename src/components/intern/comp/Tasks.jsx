import React, { useState, useEffect } from "react";
import { Bell, Eye } from "lucide-react";

export default function Dashboard({ iemail }) {
  const [tasks, setTasks] = useState([]);
  const [internData, setInternData] = useState(null);

  const internName = internData?.name || "Intern";
  const internInitials = internName.substring(0, 2).toUpperCase();

  useEffect(() => {
    const loadData = async () => {
      try {
        // 🔹 Fetch Interns
        const internRes = await fetch("http://localhost:5000/api/interns");
        const interns = await internRes.json();

        // 🔹 Find intern using email
        const currentIntern = interns.find(
          (i) =>
            i.email?.toLowerCase().trim() ===
            iemail?.toLowerCase().trim()
        );

        if (!currentIntern) {
          console.log("❌ Intern not found");
          return;
        }

        // ✅ Get ObjectId
        const internId = currentIntern._id;
        console.log("✅ Intern ObjectId:", internId);

        setInternData(currentIntern);

        // 🔹 Fetch Tasks
        const taskRes = await fetch("http://localhost:5000/api/tasks");
        const allTasks = await taskRes.json();

        // 🔥 Filter tasks using ObjectId
        const myTasks = allTasks.filter(
          (task) => String(task.internId) === String(internId)
        );

        setTasks(myTasks);

        // 🔍 Debug logs
        console.log("All Task Intern IDs:", allTasks.map(t => t.internId));
        console.log("Filtered Tasks:", myTasks);

      } catch (error) {
        console.error("❌ Error:", error);
      }
    };

    if (iemail) loadData();
  }, [iemail]);

  const statusColors = {
    Pending: "bg-orange-100 text-orange-600",
    Active: "bg-blue-100 text-blue-600",
    Reviewing: "bg-purple-100 text-purple-600",
    Completed: "bg-green-100 text-green-600",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-[Poppins]">
      
      {/* Navbar */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-blue-700">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Good Morning, {internName}
          </p>
          {/* 🔹 Show Intern ID (optional) */}
          <p className="text-xs text-gray-400">
            ID: {internData?._id}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-gray-500" />
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
            {internInitials}
          </div>
        </div>
      </header>

      {/* Task Table */}
      <div className="bg-white rounded-xl shadow border p-5">
        <h2 className="font-semibold mb-4">Task List</h2>

        <table className="w-full text-sm">
          <thead className="text-gray-500">
            <tr>
              <th className="text-left py-2">Task</th>
              <th className="text-left py-2">Deadline</th>
              <th className="text-left py-2">Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <tr key={index} className="border-t">
                  <td className="py-3">
                    {task.taskName || task.title}
                  </td>
                  <td className="py-3 text-gray-500">
                    {task.deadline || "No Deadline"}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        statusColors[task.status] || "bg-gray-100"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400">
                  No tasks assigned to you
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <p className="text-sm text-gray-500 mt-4">
          Showing {tasks.length} tasks
        </p>
      </div>
    </div>
  );
}