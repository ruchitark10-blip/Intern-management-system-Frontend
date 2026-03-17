import { PiSquaresFourThin } from "react-icons/pi";
import { LuUsers } from "react-icons/lu";
import { GiAbacus } from "react-icons/gi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { SiGoogleanalytics } from "react-icons/si";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import logo from "../../../assets/c.png";
import { LuLogOut } from "react-icons/lu";
import { Building2, Columns3Cog, PanelTop, GraduationCap } from "lucide-react";
import { MdOutlineSubscriptions } from "react-icons/md";
import BusinessIcon from "@mui/icons-material/Business";
import PieChartIcon from "@mui/icons-material/PieChart";
import { BsChatSquareQuote } from "react-icons/bs";
import { GrTask } from "react-icons/gr";

const Sidebar = ({ onLogout, active, setActive, sidebarOpen, setSidebarOpen }) => {
  const [open, setOpen] = useState(false);

  const menu = [
    {
      name: "Dashboard",
      icon: PiSquaresFourThin,
    },
    {
      name: "Attendance",
      icon: PanelTop,
    },

    // Tasks Section
    {
      name: "Tasks",
      icon: GrTask,
    },

    /* Feedback Section hidden
    {
      name: "Feedback",
      icon: BsChatSquareQuote,
    },
    */

    {
      name: "Certificate",
      icon: GraduationCap,
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
        <div className="h-[80px] px-5 font-[Poppins] flex items-center bg-white justify-between">
          <div className="flex justify-between items-center gap-2">
            <img src={logo} className="h-14" alt="logo" />
          </div>

          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <IoClose size={22} />
          </button>
        </div>

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

        <div className="p-4 border-t font-[Poppins] border-white/10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onLogout && onLogout();
            }}
            className="flex items-center rounded w-[204px] h-[44px] px-[16px] hover:bg-[#FFA138]"
          >
            <LuLogOut className="h-[18px] w-[18px]" />
            <span className="p-2 text-white font-[poppins] font-[400]">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;