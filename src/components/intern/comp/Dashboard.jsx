import { useState } from "react";
import {
  ClockIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

import { Bell } from "lucide-react";

export default function Dashboard({iemail}) {
  const [attendance, setAttendance] = useState("Not Marked");
  const [page, setPage] = useState(1);

  const [activities, setActivities] = useState([
    {
      activity: "Attendance marked",
      time: "Today 9:30 AM",
      status: "Present",
      color: "green",
    },
  ]);

  const markAttendance = () => {
    setAttendance("Present");

    setActivities([
      {
        activity: "Attendance marked",
        time: "Just now",
        status: "Present",
        color: "green",
      },
      ...activities,
    ]);
  };

  const nextPage = () => {
    if (page < 10) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row border-b justify-between items-start lg:items-center py-[14px] px-4 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          <p className="text-md text-gray-500">
            Hello, {iemail}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Bell className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
          <div className="h-9 w-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold cursor-pointer">
            <p>{iemail.substring(0, 2)}</p>
            
          </div>
        </div>
      </div>

      <div className="p-5">

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-4 mb-6 mt-5">

          <StatCard
            icon={<ClockIcon className="h-6 w-6 text-blue-500" />}
            title="Attendance"
            value={attendance === "Present" ? "92%" : "Not Marked"}
          />

          <StatCard
            icon={<AcademicCapIcon className="h-6 w-6 text-green-500" />}
            title="Certificates"
            value="Eligible"
          />

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ACTIVITY */}
          <div className="md:col-span-2 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold mb-4">Recent Activity</h2>

              <select className="border rounded px-3 py-1 text-sm cursor-pointer">
                <option value="all">View All</option>
                <option value="Rahul">Rahul</option>
                <option value="Ankit">Ankit</option>
              </select>
            </div>

            <table className="w-full text-sm bg-white mt-2 border rounded-lg overflow-hidden">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-2 ps-4">Activity</th>
                  <th className="text-left py-2">Time</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {activities.slice(0, 3).map((item, index) => (
                  <ActivityRow key={index} {...item} />
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={prevPage}
                className="px-3 py-1 border border-orange-400 rounded text-sm"
              >
                Previous
              </button>

              <span className="text-sm text-gray-500">
                Page {page} of 10
              </span>

              <button
                onClick={nextPage}
                className="px-3 py-1 border border-orange-400 rounded text-sm"
              >
                Next
              </button>
            </div>
          </div>

          {/* PRIMARY ACTION */}
          <div>
            <h2 className="font-semibold mb-4">Primary Action</h2>

            <div className="bg-white rounded-lg shadow-sm p-5">

              <button
                onClick={markAttendance}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Mark Attendance
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 items-center">
      <div>{icon}</div>

      <div className="pt-2">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-semibold text-lg">{value}</p>
      </div>
    </div>
  );
}

function ActivityRow({ activity, time, status, color }) {
  const colors = {
    green: "bg-green-100 text-green-700",
  };

  return (
    <tr className="border-b last:border-none">
      <td className="py-3 ps-4">{activity}</td>
      <td className="py-3 text-gray-500">{time}</td>
      <td className="py-3">
        <span className={`px-3 py-1 rounded-full text-xs ${colors[color]}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}