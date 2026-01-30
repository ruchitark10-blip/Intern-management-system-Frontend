import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Mentors from "./components/Mentors"
import Interns from "./components/Interns"
import Tasks from "./components/Tasks";
import { AppStateProvider } from './context/AppState';
import Attendance from "./components/Attendance";
import Reports from "./components/Reports";
import LoginScreen from "./components/LoginScreen";
import HR from "./components/HrDashboard/index"
import InternDashboard from "./components/intern/index";
import MentorDashboard from "./components/mentor/index"
import HrDashboard from "./components/HrDashboard/index"

function App() {
  const [active, setActive] = useState("Dashboard");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const roleDefaultPage = {
    "Super Admin": "Dashboard",
    "HR Manager": "Mentors",
    "Mentor": "Tasks",
    "Intern": "Tasks",
  };

  const renderPage = () => {
    switch (active) {
      case "Mentors":
        return <Mentors />;
      case "Interns":
        return <Interns />;
      case "HR":
        return <HR />;
      case "Tasks":
        return <Tasks />;
      case "Attendance":
        return <Dashboard />;
      case "Reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogin = (role) => {
    setUserRole(role);
    const page = roleDefaultPage[role] || "Dashboard";
    setActive(page);
    // Allow login for all roles so role pages open after selecting a role
    setLoggedIn(true);
    try { window.history.pushState({}, "", `/${page.toLowerCase()}`); } catch (e) {}
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserRole(null);
    setActive("Dashboard");
    try { window.history.pushState({}, "", "/login"); } catch (e) {}
  };

  if (!loggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Render role-specific dashboards for non-super-admin users
  if (userRole && userRole !== "Super Admin") {
    switch (userRole) {
      case "HR Manager":
        return <HrDashboard onLogout={handleLogout} />;
      case "Mentor":
        return <MentorDashboard onLogout={handleLogout} />;
      case "Intern":
        return <InternDashboard onLogout={handleLogout} />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow">Unknown role: {userRole}</div>
          </div>
        );
    }
  }

  return (
    <AppStateProvider>
      <div className="flex">
        <Sidebar active={active} setActive={setActive} onLogout={handleLogout} />
        <div className="flex-1 min-h-screen ">
          {renderPage()}
        </div>
      </div>
    </AppStateProvider>
  );
}

export default App;