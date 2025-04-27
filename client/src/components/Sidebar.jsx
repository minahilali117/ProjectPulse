import clsx from "clsx";
import React from "react";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Projects",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "todo/todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "Status",
    link: "status",
    icon: <IoCheckmarkDoneOutline />,
  },
  {
    label: "Trash",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    return (
      <Link
        onClick={closeSidebar}
        to={el.link}
        className={clsx(
           "w-full lg:w-3/4 flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white",
        path === el.link.split("/")[0] ? "bg-gray-700 text-white" : "text-gray-400"
        )}
      >
        {el.icon}
        {/* <span className='hover:text-gray-900 dark:hover:text-white'>{el.label}</span> */}
        <span className="text-sm font-medium">{el.label}</span>
      </Link>
    );  
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 bg-gray-900 text-gray-200">
      <div className="flex items-center gap-3">
      <img src='/5.png' alt='ProjectPulse Logo' className='h-20 w-20 object-contain' />
      <span className='text-2xl font-bold text-White dark:text-white'>
        ProjectPulse
      </span>
    </div>


    <div className="flex-1 flex flex-col gap-4 pt-8">
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      <div className=''>
      <button className="w-full flex items-center gap-3 p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200">
          <MdSettings className="text-lg" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
