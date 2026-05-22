import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const AppSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const location = useLocation();

  const sidebarItems = [
    {
      path: "/",
      text: "DASHBOARD",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      path: "/users",
      text: "USER MANAGEMENT",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {!isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm sm:hidden transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}
      <aside
        id="top-bar-sidebar"
        className={`fixed top-0 left-0 z-40 w-72 h-screen pt-16 transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? "-translate-x-full" : "translate-x-0"} sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-6 overflow-y-auto bg-white/95 backdrop-blur-md border-r border-emerald-100">
          <div className="mb-8 px-3">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-emerald-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
                <div className="w-8 h-8 text-2xl rounded-lg flex items-center justify-center">
                  ♻️
                </div>
              </div>
              <div>
                {/* <p className="text-xs text-emerald-500 font-semibold">
                  RECYCLING HUB
                </p> */}
                <p className="text-lg font-bold text-emerald-800">
                  Admin Dashboard
                </p>
              </div>
            </div>
          </div>
          <ul className="space-y-1.5 font-medium">
            {sidebarItems.map((sidebarItem, index) => (
              <li key={index}>
                <Link
                  to={sidebarItem.path}
                  onClick={() => window.innerWidth < 640 && toggleSidebar()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                    location.pathname === sidebarItem.path
                      ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                      : "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  <span
                    className={`${location.pathname === sidebarItem.path ? "text-white" : "text-emerald-500 group-hover:text-emerald-600"} transition-colors`}
                  >
                    {sidebarItem.icon}
                  </span>
                  <span className="text-sm tracking-wide">
                    {sidebarItem.text}
                  </span>
                  {location.pathname === sidebarItem.path && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
