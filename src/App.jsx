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
  const [userEmail, setUserEmail] = useState(null); // ✅ ADDED

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
    const storedEmail = localStorage.getItem("email"); // ✅ ADDED

    if (storedRole && storedToken && storedLoggedIn === "true") {
      setUserRole(storedRole);
      setUserEmail(storedEmail); // ✅ ADDED
      setLoggedIn(true);
      setActive(roleDefaultPage[storedRole] || "Dashboard");
    }
  }, []);

  const renderPage = () => {
    switch (active) {
      case "Mentors":
        return <Mentors email={userEmail}/>;
      case "Interns":
        return <Interns  email={userEmail}/>;
      case "Tasks":
        return <Tasks email={userEmail}/>;
      case "Attendance":
        return <Attendance email={userEmail}/>;
      case "Reports":
        return <Reports email={userEmail}/>;
      default:
        return <Dashboard email={userEmail} />; // 🔁 UPDATED (email pass)
    }
  };

  // Handle login
  const handleLogin = (role, token, email) => { // 🔁 UPDATED (email added)
    setUserRole(role);
    setUserEmail(email); // ✅ ADDED

    const page = roleDefaultPage[role] || "Dashboard";
    setActive(page);
    setLoggedIn(true);

    localStorage.setItem("role", role);
    localStorage.setItem("token", token);
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("email", email); // ✅ ADDED
  };

  //  Handle logout
  const handleLogout = () => {
    setLoggedIn(false);
    setUserRole(null);
    setUserEmail(null); // ✅ ADDED
    setActive("Dashboard");

    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("email"); // ✅ ADDED
  };

  //  If not logged in → show login screen
  if (!loggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  //  Mentor dashboard
  if (userRole === "mentor") {
    return <MentorDashboard email={userEmail} onLogout={handleLogout} />; // 🔁 UPDATED
  }

  //  Intern dashboard
  if (userRole === "intern") {
    return <InternDashboard email={userEmail} onLogout={handleLogout} />; // 🔁 UPDATED
  }

  //  Admin (default layout with sidebar)
  return (
    <AppStateProvider>
      <div className="flex">
        <Sidebar 
          active={active} 
          setActive={setActive} 
          onLogout={handleLogout}
          email={userEmail} // ✅ ADDED
        />
        <div className="flex-1 min-h-screen">
          {renderPage()}
        </div>
      </div>
    </AppStateProvider>
  );
}

export default App;