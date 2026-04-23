import { useEffect, useState } from "react";
import axios from "axios";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function App({ iemail }) {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [intern, setIntern] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const todayStr = new Date().toISOString().split("T")[0];

  const isTodaySelected = selectedDate === todayStr;

  // ================= FETCH INTERN =================
  useEffect(() => {
    const fetchIntern = async () => {
      try {
        const res = await axios.get("https://intern-management-system-backend-za7h.onrender.com/api/interns");

        const current = res.data.find(
          (i) =>
            i.email?.toLowerCase().trim() === iemail?.toLowerCase().trim()
        );

        if (current) setIntern(current);
      } catch (err) {
        console.error(err);
      }
    };

    if (iemail) fetchIntern();
  }, [iemail]);

  // ================= LOAD ATTENDANCE =================
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!iemail) return;

        const res = await axios.get(
          `"https://intern-management-system-backend-za7h.onrender.com/api/attendance/${iemail}`
        );

        const map = {};
        res.data.forEach((item) => {
          const key = `${item.email}_${item.date}`;
          map[key] = item;
        });

        setAttendanceData(map);
        setSelectedDate(todayStr);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [iemail]);

  const record =
    intern && selectedDate
      ? attendanceData[`${intern.email}_${selectedDate}`]
      : null;

  const isSunday = selectedDate
    ? new Date(selectedDate).getDay() === 0
    : false;

  const formatTime = (date) =>
    date
      ? new Date(date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  // ================= PUNCH =================
  const handlePunch = async (type) => {
    try {
      setLoading(true);

      if (!intern) return alert("Intern not found");

      // 🔒 ONLY TODAY
      if (!isTodaySelected) {
        return alert("You can only mark attendance for today");
      }

      if (isSunday) return alert("Sunday Holiday 🚫");

      const url =
        type === "in"
          ? "https://intern-management-system-backend-za7h.onrender.com/api/attendance/check-in"
          : "https://intern-management-system-backend-za7h.onrender.com/api/attendance/check-out";

      const body =
        type === "in"
          ? { name: intern.name, email: intern.email, date: selectedDate }
          : { email: intern.email, date: selectedDate };

      await axios.post(url, body);

      const refresh = await axios.get(
        `https://intern-management-system-backend-za7h.onrender.com/api/attendance/${iemail}`
      );

      const map = {};
      refresh.data.forEach((item) => {
        const key = `${item.email}_${item.date}`;
        map[key] = item;
      });

      setAttendanceData(map);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  // ================= STATUS =================
  const getStatus = () => {
    if (isSunday) return "Holiday";

    if (!record?.checkIn) {
      return selectedDate === todayStr ? "Not Marked" : "Absent";
    }

    if (record?.checkIn && !record?.checkOut) {
      return "In Progress";
    }

    if (record?.checkIn && record?.checkOut) {
      const hour = new Date(record.checkIn).getHours();
      return hour > 10 ? "Half Day" : "Completed";
    }

    return "Absent";
  };

  // ================= COLOR =================
  const getColor = (date) => {
    const full = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;

    const rec = intern && attendanceData[`${intern.email}_${full}`];
    const day = new Date(year, month, date).getDay();

    if (day === 0) return "bg-red-300 text-red-700";

    if (rec?.checkIn && rec?.checkOut) {
      return "bg-blue-500 text-white";
    }

    if (rec?.checkIn) {
      return "bg-green-500 text-white";
    }

    return "bg-white border";
  };

  // ================= DISABLE ONLY SUNDAY =================
  const isDisabled = (date) => {
    return new Date(year, month, date).getDay() === 0;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="font-semibold text-lg mb-4">
        Attendance {intern?.name && `- ${intern.name}`}
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {/* CALENDAR */}
        <div className="col-span-2 bg-white p-5 rounded-xl shadow border">

          <div className="flex justify-between mb-4">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>‹</button>
            <h2>
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>›</button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3">
            {days.map((d) => (
              <div key={d} className="text-center border p-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(firstDay)].map((_, i) => <div key={i}></div>)}

            {[...Array(daysInMonth)].map((_, i) => {
              const date = i + 1;

              return (
                <button
                  key={date}
                  onClick={() =>
                    setSelectedDate(
                      `${year}-${String(month + 1).padStart(2, "0")}-${String(
                        date
                      ).padStart(2, "0")}`
                    )
                  }
                  disabled={isDisabled(date)}
                  className={`h-10 w-10 rounded-full ${getColor(date)} ${
                    isDisabled(date) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {date}
                </button>
              );
            })}
          </div>
        </div>

        {/* STATUS */}
        <div className="bg-white border rounded-xl shadow p-4 h-fit">

          <h2 className="text-xs text-gray-500 mb-2">Status</h2>

          <div className="p-2 rounded text-center font-semibold text-sm bg-gray-100">
            {getStatus()}
          </div>

          {record?.checkIn && (
            <p className="text-xs mt-2 text-gray-500">
              ⏰ Check In: <b>{formatTime(record.checkIn)}</b>
            </p>
          )}

          {record?.checkOut && (
            <p className="text-xs mt-1 text-gray-500">
              ⏰ Check Out: <b>{formatTime(record.checkOut)}</b>
            </p>
          )}

          {!isTodaySelected && (
            <p className="text-xs text-gray-500 mt-2">
              Attendance can only be marked for today
            </p>
          )}
        </div>

      </div>

      {/* BUTTONS */}
      <div className="bg-white border mt-6 p-5 rounded-xl">

        <button
          onClick={() => handlePunch("in")}
          disabled={!isTodaySelected || record?.checkIn || loading || isSunday}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Processing..." : "Punch In"}
        </button>

        <button
          onClick={() => handlePunch("out")}
          disabled={!isTodaySelected || record?.checkOut || loading || isSunday}
          className="w-full mt-3 bg-red-600 text-white py-2 rounded"
        >
          {loading ? "Processing..." : "Punch Out"}
        </button>

      </div>
    </div>
  );
}