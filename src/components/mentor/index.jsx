import { useState } from "react";
import Dashboard from "./comp/Dashboard";
import Interns from "./comp/interns";
import Assign_task from "./comp/Assign_task";
import Sidebar from "./comp/Siderbar";
import Review_submissions from "./comp/Review_submissions"

function App({ onLogout,email }) {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (active) {
      case "Interns":
        return <Interns memail={email}/>;
      case "Assign Task":
        return <Assign_task />;
      case "Review Submissions":
        return <Review_submissions />;
      default:
        return <Dashboard memail={email}/>;
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
