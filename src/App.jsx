import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Mentors from "./components/Mentors";
import Interns from "./components/Interns";
import Tasks from "./components/Tasks";
import { AppStateProvider } from './context/AppState';
import Attendance from "./components/Attendance";
import Reports from "./components/Reports";
import LoginScreen from "./components/LoginScreen";
import InternDashboard from "./components/intern/index";
import MentorDashboard from "./components/mentor/index";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [active, setActive] = useState("Dashboard");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const roleDefaultPage = {
    admin: "Dashboard",
    mentor: "Tasks",
    intern: "Tasks",
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedLoggedIn = localStorage.getItem("loggedIn");
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");

    if (storedRole && storedToken && storedLoggedIn === "true") {
      setUserRole(storedRole);
      setUserEmail(storedEmail);
      setLoggedIn(true);
      setActive(roleDefaultPage[storedRole] || "Dashboard");
    }
  }, []);

  const renderPage = () => {
    switch (active) {
      case "Mentors":
        return <Mentors email={userEmail}/>;
      case "Interns":
        return <Interns email={userEmail}/>;
      case "Tasks":
        return <Tasks email={userEmail}/>;
      case "Attendance":
        return <Attendance email={userEmail}/>;
      case "Reports":
        return <Reports email={userEmail}/>;
      default:
        return <Dashboard email={userEmail} />;
    }
  };

  const handleLogin = (role, token, email) => {
    setUserRole(role);
    setUserEmail(email);
    const page = roleDefaultPage[role] || "Dashboard";
    setActive(page);
    setLoggedIn(true);

    localStorage.setItem("role", role);
    localStorage.setItem("token", token);
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("email", email);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserRole(null);
    setUserEmail(null);
    setActive("Dashboard");

    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("email");
  };

  // ✅ FIX: PUBLIC ROUTES (LOGIN + RESET PASSWORD)
  if (!loggedIn) {
    return (
      <Routes>
        <Route path="/" element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    );
  }

  if (userRole === "mentor") {
    return <MentorDashboard email={userEmail} onLogout={handleLogout} />;
  }

  if (userRole === "intern") {
    return <InternDashboard email={userEmail} onLogout={handleLogout} />;
  }

  return (
    <AppStateProvider>
      <div className="flex">
        <Sidebar
          active={active}
          setActive={setActive}
          onLogout={handleLogout}
          email={userEmail}
        />
        <div className="flex-1 min-h-screen">
          {renderPage()}
        </div>
      </div>
    </AppStateProvider>
  );
}

export default App;