import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Users, ClipboardClock, ClipboardList, MessageSquareQuote } from "lucide-react";
import AddTaskModal from "./AddTaskModal";

const itemsPerPage = 5;

export default function Dashboard() {

  const stats = [
    { title: "Assigned Interns", value: 12, color: "bg-orange-100 text-orange-600", icon: Users },
    { title: "Tasks Assigned", value: 25, color: "bg-blue-100 text-blue-600", icon: ClipboardList },
    { title: "Pending Reviews", value: 8, color: "bg-purple-100 text-purple-600", icon: ClipboardClock },
    { title: "Feedback Given", value: 18, color: "bg-green-100 text-green-600", icon: MessageSquareQuote },
  ];

  const [tasks, setTasks] = useState([
    {
      name: "Michael Roberts",
      email: "michael.r@company.com",
      avatar: "https://i.pravatar.cc/40?img=1",
      task: "UI Dashboard",
      status: "Submitted",
      date: "Nov 12, 2025",
    },
    {
      name: "Emma Thompson",
      email: "emma.t@company.com",
      avatar: "https://i.pravatar.cc/40?img=2",
      task: "API Integration",
      status: "Pending",
      date: "Oct 23, 2025",
    },
    {
      name: "Lisa Wang",
      email: "lisa.w@company.com",
      avatar: "https://i.pravatar.cc/40?img=3",
      task: "Testing Module",
      status: "Submitted",
      date: "Dec 12, 2025",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = tasks.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="min-h-screen font-[Poppins] bg-gray-50">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b px-4 py-4 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#1F2A5B]">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#1F2A5B]">
              Welcome back, Sarah. Here's what's happening today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white w-full sm:w-auto px-4 h-9 rounded-lg text-sm"
            >
              + Assign Task
            </button>

            <div className="flex items-center gap-4">
              <Bell className="text-gray-500" />
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                SI
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {stats.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="border rounded-lg p-4 bg-white">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-400">{item.title}</p>
                  <h2 className="text-xl font-semibold">{item.value}</h2>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-x-auto px-4">
          <table className="w-full min-w-[800px] text-sm bg-white rounded-lg overflow-hidden">
            <thead className="text-gray-400 border-b">
              <tr>
                <th className="py-3 px-6 text-left">Intern Name</th>
                <th className="py-3 text-left">Task Name</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Submitted Date</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt=""
                      className="w-9 h-9 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.email}</p>
                    </div>
                  </td>

                  <td className="py-4">{item.task}</td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Submitted"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-4">{item.date}</td>

                  <td className="py-4 px-6 text-right text-blue-500 cursor-pointer">
                    View
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 text-sm border-t mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`border px-4 py-1 rounded ${
              currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-orange-500 border-orange-400"
            }`}
          >
            Previous
          </button>

          <p className="text-gray-500">
            Page {currentPage} of {totalPages}
          </p>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`border px-4 py-1 rounded ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-orange-500 border-orange-400"
            }`}
          >
            Next
          </button>
        </div>

        {/* Modal */}
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTask={handleAddTask}
        />

      </div>
    </>
  );
}
