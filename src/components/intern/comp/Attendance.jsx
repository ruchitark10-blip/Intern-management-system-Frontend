import { useEffect, useState } from "react";
import axios from "axios";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function App({ iemail }) {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [punchIn, setPunchIn] = useState(null);
  const [intern, setIntern] = useState(null);

  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // ================= FETCH INTERN =================
  useEffect(() => {
    const fetchIntern = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/interns");

        const currentIntern = res.data.find(
          (i) =>
            i.email?.toLowerCase().trim() ===
            iemail?.toLowerCase().trim()
        );

        if (currentIntern) {
          setIntern(currentIntern);
        }
      } catch (err) {
        console.error("Intern fetch error", err);
      }
    };

    if (iemail) fetchIntern();
  }, [iemail]);

  // ================= LOAD ATTENDANCE =================
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/attendance"
        );

        const map = {};

        res.data.forEach((item) => {
          const key = `${item.email}_${item.date}`;
          map[key] = item;
        });

        setAttendanceData(map);

        const today = new Date().toISOString().split("T")[0];
        const todayKey = `${iemail}_${today}`;

        setSelectedDate(today);
        setPunchIn(map[todayKey]?.checkIn || null);
      } catch (err) {
        console.error("Attendance load error", err);
      }
    };

    if (iemail) loadData();
  }, [iemail]);

  // ================= DATE CLICK =================
  const handleDateClick = (date) => {
    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;

    setSelectedDate(fullDate);

    const key = `${iemail}_${fullDate}`;
    setPunchIn(attendanceData[key]?.checkIn || null);
  };

  // ================= PUNCH IN (SUNDAY BLOCK ADDED) =================
  const handlePunchIn = async () => {
    const today = new Date().getDay(); // 0 = Sunday

    if (today === 0) {
      alert("🚫 Sunday is a Holiday. Attendance not allowed.");
      return;
    }

    try {
      if (!intern) {
        alert("Intern not found");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/attendance/check-in",
        {
          name: intern.name,
          email: intern.email,
        }
      );

      alert(res.data?.message || "Success");

      const updated = await axios.get(
        "http://localhost:5000/api/attendance"
      );

      const map = {};

      updated.data.forEach((item) => {
        const key = `${item.email}_${item.date}`;
        map[key] = item;
      });

      setAttendanceData(map);

      const todayDate = new Date().toISOString().split("T")[0];
      setPunchIn(map[`${intern.email}_${todayDate}`]?.checkIn || null);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ================= COLOR LOGIC (SUNDAY ADDED) =================
  const getColor = (date) => {
    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;

    const key = `${iemail}_${fullDate}`;
    const record = attendanceData[key];

    const dayOfWeek = new Date(fullDate).getDay();

    // 🔴 SUNDAY COLOR
    if (dayOfWeek === 0) {
      return "bg-red-300 text-white";
    }

    if (record?.checkIn) return "bg-green-400 text-white";

    return "bg-white border";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="font-semibold text-lg mb-4">
        Attendance {intern?.name && `- ${intern.name}`}
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="col-span-2 bg-white p-5 rounded-xl shadow-sm border">
          
          {/* MONTH NAV */}
          <div className="flex justify-between mb-4 items-center">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              ‹
            </button>

            <h2 className="font-medium">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              ›
            </button>
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {days.map((day) => (
              <div
                key={day}
                className="text-center text-sm border p-2 rounded-lg font-medium bg-gray-50"
              >
                {day}
              </div>
            ))}
          </div>

          {/* CALENDAR */}
          <div className="grid grid-cols-7 gap-2">
            {[...Array(firstDay)].map((_, i) => (
              <div key={i}></div>
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
              const date = i + 1;

              const isToday =
                date === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <button
                  key={date}
                  onClick={() => handleDateClick(date)}
                  className={`h-10 w-10 rounded-full ${getColor(date)} ${
                    isToday ? "border-2 border-blue-500" : ""
                  }`}
                >
                  {date}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-5 rounded-xl border bg-white shadow-sm">
          <p className="mb-2">
            Status:{" "}
            {punchIn ? (
              <span className="text-green-600 font-semibold">Done ✅</span>
            ) : (
              <span className="text-gray-500">Not Marked</span>
            )}
          </p>

          <p>
            Punch In:{" "}
            {punchIn ? new Date(punchIn).toLocaleTimeString() : "-"}
          </p>

          {punchIn && (
            <div className="bg-green-100 text-green-700 p-2 rounded mt-3">
              Attendance Marked Successfully ✅
            </div>
          )}
        </div>
      </div>

      {/* BUTTON */}
      <div className="bg-white border mt-6 p-5 rounded-xl shadow-sm">
        <button
          onClick={handlePunchIn}
          disabled={punchIn}
          className={`w-full py-2 rounded-lg ${
            punchIn
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {punchIn ? "Already Checked In" : "Punch In"}
        </button>
      </div>
    </div>
  );
}