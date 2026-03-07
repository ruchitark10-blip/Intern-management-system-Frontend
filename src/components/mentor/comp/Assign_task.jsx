import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { TiEdit } from "react-icons/ti";
import { Bell, Search } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import AddTaskModal from "./AddTaskModal";

const data = [
  {
    task: "UI Design",
    plan: "Rahul,Sneha",
    interns: 250,
    status: "Active",
    date: "Nov 12, 2024",
  },
  {
    task: "API Integration",
    plan: "Rahul,Sneha",
    interns: 27,
    status: "Active",
    date: "Oct 23, 2024",
  },
  {
    task: "Testing Module",
    plan: "Rahul,Sneha",
    interns: 200,
    status: "Expired",
    date: "Dec 12, 2024",
  },
  {
    task: "UI Dashboard",
    plan: "Rahul,Sneha",
    interns: 24,
    status: "Reviewing",
    date: "Oct 23, 2024",
  },
  {
    task: "UI Design",
    plan: "Rahul,Sneha",
    interns: 250,
    status: "Active",
    date: "Nov 12, 2024",
  },
  {
    task: "API Integration",
    plan: "Rahul,Sneha",
    interns: 27,
    status: "Active",
    date: "Oct 23, 2024",
  },
  {
    task: "Testing Module",
    plan: "Rahul,Sneha",
    interns: 200,
    status: "Expired",
    date: "Dec 12, 2024",
  },
  {
    task: "UI Dashboard",
    plan: "Rahul,Sneha",
    interns: 24,
    status: "Reviewing",
    date: "Oct 23, 2024",
  },
];

const ITEMS_PER_PAGE = 6;

export default function Compaines() {
  const [page, setPage] = useState(1);
  const [statusOpen, setStatusOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins]">

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

      {/* Filters */}
      <div className="px-4 py-4">
        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative w-full md:flex-[2] h-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} />
            <input
              className="w-full h-full pl-10 pr-4 border rounded-sm text-sm"
              placeholder="Search Companies, plans..."
            />
          </div>

          <div className="flex gap-2 w-full md:flex-[1]">

            {/* Status */}
            <div className="relative w-full">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="w-full flex justify-between items-center border px-3 py-2 text-sm rounded-sm bg-white"
              >
                All Status <IoIosArrowDown />
              </button>

              {statusOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
                  {["Active", "Reviewing", "Expired"].map((s) => (
                    <div key={s} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plan */}
            <div className="relative w-full">
              <button
                onClick={() => setPlanOpen(!planOpen)}
                className="w-full flex justify-between items-center border px-3 py-2 text-sm rounded-sm bg-white"
              >
                All Plans <IoIosArrowDown />
              </button>

              {planOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
                  {["Starter", "Professional", "Enterprise"].map((p) => (
                    <div key={p} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      {p}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-4 -mx-4 sm:mx-0">
        <table className="w-full min-w-[900px] text-sm bg-white border rounded-lg">
          <thead className="text-gray-400 border-b">
            <tr>
              <th className="text-left py-3 ps-4">Task Title</th>
              <th className="text-center">Assigned Intern</th>
              <th className="text-center">Deadline</th>
              <th className="text-center">Status</th>
              <th className="text-right pe-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item, i) => (
              <tr key={i} className="border font-[poppins]">
                <td className="py-4 ps-4">{item.task}</td>
                <td className="text-center">{item.plan}</td>

                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : item.status === "Expired"
                        ? "bg-red-100 text-red-500"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {item.date}
                  </span>
                </td>

                <td className="text-center">{item.status}</td>

                <td className="text-right pe-4">
                  <div className="flex justify-end gap-3">
                    <FiEye className="cursor-pointer" />
                    <TiEdit className="text-blue-600 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t text-sm bg-white text-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="border px-4 py-2 border-orange-500 text-orange-500 rounded-lg disabled:opacity-50 w-full sm:w-auto"
        >
          Previous
        </button>

        <span>
          Page {page} of {Math.ceil(data.length / ITEMS_PER_PAGE)}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, Math.ceil(data.length / ITEMS_PER_PAGE)))}
          disabled={page === Math.ceil(data.length / ITEMS_PER_PAGE)}
          className="border border-orange-500 px-4 py-2 text-orange-500 rounded-lg disabled:opacity-50 w-full sm:w-auto"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}