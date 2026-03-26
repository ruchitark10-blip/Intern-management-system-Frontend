import { useState } from "react";
import Dashboard from "./comp/Dashboard"
import Certificate from "./comp/Certificate"
import Feedback from "./comp/Feedback"
import Sidebar from  "./comp/sidebar"
import Tasks from "./comp/Tasks";
import Attendance from "./comp/Attendance";


function App({ onLogout,email }) {
   const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  const renderPage = () => {
    switch (active) {
      case "Attendance":
        return <Attendance/>;
      case "Tasks":
        return <Tasks/>;
      case "Feedback":
        return <Feedback/>;
      case "Certificate":
        return <Certificate/>;
      default:
        return <Dashboard iemail={email}/>;
    }
  };

  return (


      <div className="flex">
     
      <Sidebar
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        onLogout={onLogout}
      />

      
      <div className="flex-1 min-h-screen">
       
        <div className="md:hidden p-3">
          <button onClick={() => setSidebarOpen(true)} className="text-xl">
            ☰
          </button>
        </div>
        {renderPage()}
      </div>
    </div>
   
  );
}

export default App;
