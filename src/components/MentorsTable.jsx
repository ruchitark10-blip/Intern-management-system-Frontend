
import { useState } from "react";

export default function MentorsTable({ data, setData }) {
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);

  const start = (page - 1) * PAGE_SIZE;
  const paginated = data.slice(start, start + PAGE_SIZE);

  const deleteMentor = (id) => {
    setData(data.filter((m) => m.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <table className="w-full text-sm">
        <thead className="text-gray-400">
          <tr>
            <th>Mentor</th>
            <th>Interns</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((m) => (
            <tr key={m.id} className="border-t">
              <td>{m.name}</td>
              <td>{m.interns}</td>
              <td>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                  Active
                </span>
              </td>
              <td className="space-x-2">
                <button className="text-blue-500">Edit</button>
                <button
                  onClick={() => deleteMentor(m.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="border px-3 py-1 rounded"
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button
          disabled={start + PAGE_SIZE >= data.length}
          onClick={() => setPage(page + 1)}
          className="border px-3 py-1 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
