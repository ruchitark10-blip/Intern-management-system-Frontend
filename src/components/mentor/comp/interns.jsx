import { useState } from "react";
import { Bell } from "lucide-react";
import AddTaskModal from "./AddTaskModal";

export default function InternTable() {

  const [data, setData] = useState([
    {
      name: "Michael Roberts",
      email: "michael.r@company.com",
      avatar: "https://i.pravatar.cc/40?img=1",
      task: 6,
      date: "Nov 12, 2025",
      status: "Submitted",
    },
    {
      name: "Emma Thompson",
      email: "emma.t@company.com",
      avatar: "https://i.pravatar.cc/40?img=2",
      task: 9,
      date: "Oct 23, 2025",
      status: "Pending",
    },
    {
      name: "Lisa Wang",
      email: "lisa.w@company.com",
      avatar: "https://i.pravatar.cc/40?img=3",
      task: 4,
      date: "Dec 12, 2025",
      status: "Submitted",
    },
    {
      name: "John Carter",
      email: "john.c@company.com",
      avatar: "https://i.pravatar.cc/40?img=4",
      task: 5,
      date: "Dec 12, 2025",
      status: "Submitted",
    },
    {
      name: "Alex Brown",
      email: "alex.b@company.com",
      avatar: "https://i.pravatar.cc/40?img=5",
      task: 7,
      date: "Jan 02, 2026",
      status: "Pending",
    },
    {
      name: "Sophia Lee",
      email: "sophia.l@company.com",
      avatar: "https://i.pravatar.cc/40?img=6",
      task: 3,
      date: "Jan 05, 2026",
      status: "Submitted",
    },
  ]);

  const itemsPerPage = 4;
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = (newTask) => {
    const newIntern = {
      name: newTask.name,
      email: newTask.email,
      avatar: newTask.avatar,
      task: 1,
      date: newTask.date,
      status: newTask.status,
    };

    setData((prev) => [newIntern, ...prev]);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const currentData = data.slice(start, start + itemsPerPage);

  return (
    <>
      <div className="font-[Poppins]">

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

        {/* Table */}
        <div className="bg-white rounded-sm shadow-sm mx-2 my-5 border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">Intern Name</th>
                  <th className="px-4 py-3 text-left">Total Task</th>
                  <th className="px-4 py-3 text-left">Duration</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item, i) => (
                  <tr key={i} className="border">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={item.avatar}
                        className="w-9 h-9 rounded-full"
                        alt=""
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3">{item.task}</td>

                    <td className="px-4 py-3">{item.date}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          item.status === "Submitted"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-blue-500 cursor-pointer">
                      View
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="border px-4 py-1 rounded text-orange-500 border-orange-400 disabled:opacity-40"
            >
              Previous
            </button>

            <p className="text-gray-500">
              Page {page} of {totalPages}
            </p>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="border px-4 py-1 rounded text-orange-500 border-orange-400 disabled:opacity-40"
            >
              Next
            </button>
          </div>
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