import { PiSquaresFourThin } from "react-icons/pi";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import logo from "../assets/c.png";
import { FiSettings } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { Columns3Cog, PanelTop } from "lucide-react";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { GrTask } from "react-icons/gr";
import { PiFilesFill } from "react-icons/pi";

const Sidebar = ({ active, setActive, sidebarOpen, setSidebarOpen, onLogout }) => {
  const [open, setOpen] = useState(false);
  
  const menu = [
    {
      name: "Dashboard",
      icon: PiSquaresFourThin,
    },
    {
      name: "Mentors",
      icon: FaUser,
    },
    {
      name: "Interns",
      icon: FaUsers,
    },
    /* ---------------------------------------------------------
       HIDDEN COMPONENTS (Commented out so they won't be seen)
       ---------------------------------------------------------
    {
      name: "Tasks",
      icon: GrTask,
    },
    
    {
      name: "Report",
      icon: PiFilesFill,
    },
    --------------------------------------------------------- */
    {
      name: "Attendance",
      icon: PanelTop,
    },

  ];
  
  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed font-[Poppins] inset-0 bg-[#FFA138] z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          min-h-screen w-[240px]
          bg-[#08469D] text-white
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* Logo Section */}
        <div className="h-[80px] px-5 font-[Poppins] flex items-center bg-white justify-between">
          <div className="flex justify-between items-center gap-2">
            <img src={logo} className="h-14" alt="logo" />
          </div>

          <button className="md:hidden text-black" onClick={() => setSidebarOpen(false)}>
            <IoClose size={22} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 font-[Poppins] px-4 pt-2 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActive(item.name);
                  setSidebarOpen(false);
                }}
                className={`
                  flex items-center gap-3 w-full h-[44px] px-4 rounded
                  hover:bg-[#FFA138] transition
                  ${active === item.name ? "bg-[#FFA138]" : ""}
                `}
              >
                <Icon size={18} />
                <span className="text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t font-[Poppins] border-white/10">
          {/*
          <a
            href="#"
            className="flex items-center rounded w-full h-[44px] px-[16px] hover:bg-[#FFA138]"
          >
            <FiSettings className="h-[18px] w-[18px] " />
            <p className="p-2 text-white font-[poppins] font-[400] ">Settings</p>
          </a>
          */}

          <button
            onClick={() => onLogout && onLogout()}
            className="flex items-center rounded w-full h-[44px] px-[16px] hover:bg-[#FFA138] text-left"
          >
            <LuLogOut className="h-[18px] w-[18px] " />
            <p className="p-2 text-white font-[poppins] font-[400] ">Logout</p>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;