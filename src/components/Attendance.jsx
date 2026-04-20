import React, { useEffect, useState } from "react";

const Attendance = () => {
  const [interns, setInterns] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [filterIntern, setFilterIntern] = useState("");

  useEffect(() => {
    fetchInterns();
    fetchAttendance();
  }, []);

  const fetchInterns = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/interns");
      const data = await res.json();
      setInterns(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Intern fetch error", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attendance");
      const data = await res.json();
      setAttendance(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Attendance fetch error", err);
    }
  };

  // ================= FILTER =================
  const filteredData = attendance.filter((a) => {
    const matchIntern = filterIntern ? a.email === filterIntern : true;
    return matchIntern;
  });

  // ================= INTERN SUMMARY =================
  const internSummary = interns.map((intern) => {
    const records = attendance.filter(
      (a) => a.email === intern.email
    );

    const presentDays = records.filter((r) => r.checkIn).length;

    return {
      name: intern.name,
      email: intern.email,
      joinedDate: intern.joinedDate,
      presentDays,
    };
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-lg font-semibold mb-4">
        Attendance Report
      </h1>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-4 mb-6">

        <select
          value={filterIntern}
          onChange={(e) => setFilterIntern(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Interns</option>
          {interns.map((i) => (
            <option key={i.email} value={i.email}>
              {i.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setFilterIntern("");
          }}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          Reset
        </button>
      </div>

      {/* ================= INTERN SUMMARY TABLE ================= */}
      <div className="bg-white rounded-xl border shadow-sm overflow-auto mb-6">
        <h2 className="p-4 font-semibold">Intern Summary</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Joined Date</th>
              <th className="p-3 border">Days Present</th>
            </tr>
          </thead>

          <tbody>
            {internSummary.map((intern, i) => (
              <tr key={i} className="text-center border-t">

                <td className="p-2 border">{intern.name}</td>
                <td className="p-2 border">{intern.email}</td>

                <td className="p-2 border">
                  {intern.joinedDate
                    ? new Date(intern.joinedDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-2 border font-semibold text-blue-600">
                  {intern.presentDays}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ATTENDANCE TABLE ================= */}
      <div className="bg-white rounded-xl border shadow-sm overflow-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Check In</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, i) => {
              const intern = interns.find(
                (x) => x.email === row.email
              );

              return (
                <tr key={i} className="text-center border-t">

                  <td className="p-2 border">
                    {intern?.name || "-"}
                  </td>

                  <td className="p-2 border">{row.email}</td>
                  <td className="p-2 border">{row.date}</td>

                  <td className="p-2 border">
                    {row.checkIn
                      ? new Date(row.checkIn).toLocaleTimeString()
                      : "-"}
                  </td>

                  <td
                    className={`p-2 border ${
                      row.checkIn
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {row.checkIn ? "Present" : "Absent"}
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default Attendance;