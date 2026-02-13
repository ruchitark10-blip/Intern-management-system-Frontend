import { useState, useEffect } from "react";
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

function App() {
  const [active, setActive] = useState("Dashboard");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  //  Roles must match backend exactly
  const roleDefaultPage = {
    admin: "Dashboard",
    mentor: "Tasks",
    intern: "Tasks",
  };

  //  Restore login from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedLoggedIn = localStorage.getItem("loggedIn");
    const storedToken = localStorage.getItem("token");

    if (storedRole && storedToken && storedLoggedIn === "true") {
      setUserRole(storedRole);
      setLoggedIn(true);
      setActive(roleDefaultPage[storedRole] || "Dashboard");
    }
  }, []);

  const renderPage = () => {
    switch (active) {
      case "Mentors":
        return <Mentors />;
      case "Interns":
        return <Interns />;
      case "Tasks":
        return <Tasks />;
      case "Attendance":
        return <Attendance />;
      case "Reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  // Handle login
  const handleLogin = (role, token) => {
    setUserRole(role);
    const page = roleDefaultPage[role] || "Dashboard";
    setActive(page);
    setLoggedIn(true);

    localStorage.setItem("role", role);
    localStorage.setItem("token", token);
    localStorage.setItem("loggedIn", "true");
  };

  //  Handle logout
  const handleLogout = () => {
    setLoggedIn(false);
    setUserRole(null);
    setActive("Dashboard");

    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("loggedIn");
  };

  //  If not logged in → show login screen
  if (!loggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  //  Mentor dashboard
  if (userRole === "mentor") {
    return <MentorDashboard onLogout={handleLogout} />;
  }

  //  Intern dashboard
  if (userRole === "intern") {
    return <InternDashboard onLogout={handleLogout} />;
  }

  //  Admin (default layout with sidebar)
  return (
    <AppStateProvider>
      <div className="flex">
        <Sidebar active={active} setActive={setActive} onLogout={handleLogout} />
        <div className="flex-1 min-h-screen">
          {renderPage()}
        </div>
      </div>
    </AppStateProvider>
  );
}

export default App;
