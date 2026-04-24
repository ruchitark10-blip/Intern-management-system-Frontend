import React, { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Attendance = () => {
  const [interns, setInterns] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filterIntern, setFilterIntern] = useState("");

  useEffect(() => {
    fetchInterns();
    fetchAttendance();
  }, []);

  // ================= IST TIME FORMAT =================
  const formatIST = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ================= FETCH INTERNS =================
  const fetchInterns = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/interns"
      );
      const data = await res.json();
      setInterns(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH ATTENDANCE =================
  const fetchAttendance = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/attendance"
      );
      const data = await res.json();
      setAttendance(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    if (!date) return "-";

    if (typeof date === "string" && date.length === 10) return date;

    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";

    return d.toISOString().split("T")[0];
  };

  // ================= TABLE DATA =================
  const tableData = useMemo(() => {
    const rows = [];

    interns.forEach((intern) => {
      const internAttendance = attendance.filter(
        (a) => a.email === intern.email
      );

      if (internAttendance.length === 0) {
        rows.push({
          name: intern.name,
          email: intern.email,
          date: formatDate(new Date()),
          checkIn: null,
          checkOut: null,
          status: "Absent",
        });
      } else {
        internAttendance.forEach((a) => {
          rows.push({
            name: intern.name,
            email: a.email,
            date: formatDate(a.date),
            checkIn: a.checkIn,
            checkOut: a.checkOut,
            status: a.checkIn ? "Present" : "Absent",
          });
        });
      }
    });

    return rows;
  }, [interns, attendance]);

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return tableData.filter((a) =>
      filterIntern ? a.email === filterIntern : true
    );
  }, [tableData, filterIntern]);

  // ================= STATS =================
  const stats = useMemo(() => {
    const total = tableData.length;

    const present = tableData.filter((a) => a.status === "Present").length;
    const absent = tableData.filter((a) => a.status === "Absent").length;

    return {
      total,
      present,
      absent,
      percent: total ? ((present / total) * 100).toFixed(1) : 0,
    };
  }, [tableData]);

  // ================= EXPORT =================
  const exportExcel = () => {
    const data = tableData.map((a) => ({
      Name: a.name,
      Email: a.email,
      Date: a.date,
      "Check In": a.checkIn ? formatIST(a.checkIn) : "-",
      "Check Out": a.checkOut ? formatIST(a.checkOut) : "-",
      Status: a.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "attendance_report.xlsx");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-xl font-bold mb-4">
        📊 Attendance Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 border rounded shadow">
          <p>Total</p>
          <h2 className="font-bold text-xl">{stats.total}</h2>
        </div>

        <div className="bg-green-100 p-4 border rounded shadow">
          <p>Present</p>
          <h2 className="font-bold text-green-700 text-xl">{stats.present}</h2>
        </div>

        <div className="bg-red-100 p-4 border rounded shadow">
          <p>Absent</p>
          <h2 className="font-bold text-red-600 text-xl">{stats.absent}</h2>
        </div>

      </div>

      {/* FILTER */}
      <div className="flex gap-4 mb-6">

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
          onClick={() => setFilterIntern("")}
          className="bg-gray-200 px-3 py-2 rounded"
        >
          Reset
        </button>

        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white border rounded shadow overflow-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Check In</th>
              <th className="p-2 border">Check Out</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="text-center">

                <td className="border p-2">{row.name}</td>
                <td className="border p-2">{row.email}</td>
                <td className="border p-2 font-semibold">{row.date}</td>

                <td className="border p-2">
                  {row.checkIn ? formatIST(row.checkIn) : "-"}
                </td>

                <td className="border p-2">
                  {row.checkOut ? formatIST(row.checkOut) : "-"}
                </td>

                <td className="border p-2">
                  {row.status === "Absent" ? (
                    <span className="text-red-600">Absent</span>
                  ) : (
                    <span className="text-green-600">Present</span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
};

export default Attendance;