import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const AppSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const location = useLocation();
  const [managementOpen, setManagementOpen] = useState(false);
  // Separate state for laboratory management dropdown
  const [laboratoryOpen, setLaboratoryOpen] = useState(false);

  const sidebarItems = [
    {
      path: "/dashboard",
      text: "Dashboard",
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
  ];

  const userManagementItems = [
    {
      path: "/users",
      text: "Users",
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
            d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 11a4 4 0 100-8 4 4 0 000 8z"
          />
        </svg>
      ),
    },
    {
      path: "/roles",
      text: "Roles",
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      path: "/courses",
      text: "Courses",
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      path: "/categories",
      text: "Categories",
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
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
    },
  ];

  const laboratoryManagementItems = [
    {
      path: "/laboratories",
      text: "Laboratories",
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const userManagementActive = userManagementItems.some((item) =>
    isActive(item.path),
  );

  const laboratoryManagementActive = laboratoryManagementItems.some((item) =>
    isActive(item.path),
  );

  useEffect(() => {
    if (userManagementActive) {
      setManagementOpen(true);
    }
  }, [userManagementActive]);

  useEffect(() => {
    if (laboratoryManagementActive) {
      setLaboratoryOpen(true);
    }
  }, [laboratoryManagementActive]);

  return (
    <>
      {!isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm sm:hidden transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}
      <aside
        id="top-bar-sidebar"
        className={`fixed top-0 left-0 z-40 w-72 h-screen pt-16 transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? "-translate-x-full" : "translate-x-0"} sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-5 overflow-y-auto  [-ms-overflow-style:none]  bg-[#1C2B5E] border-r border-[#6B1E3C]/30">
          <div className="mb-6 px-3">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#c9a84c]/20">
              <div className="w-10 h-10 rounded-xl bg-[#6B1E3C]/30 border border-[#c9a84c]/30 flex items-center justify-center shadow-md overflow-hidden">
                <img
                  src="src/assets/img/ChtmLogo.png"
                  alt="FCU-CHTM Logo"
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.18em] font-bold text-[#c9a84c] uppercase">
                  ERIMS
                </p>
                <p className="text-sm font-bold text-white leading-tight">
                  Admin Dashboard
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3 px-1">
            <div>
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.15em] text-[#c9a84c]/50 uppercase">
                Overview
              </p>
              <ul className="space-y-1 font-medium">
                {sidebarItems.map((sidebarItem, index) => (
                  <li key={index}>
                    <Link
                      to={sidebarItem.path}
                      onClick={() => window.innerWidth < 640 && toggleSidebar()}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        location.pathname === sidebarItem.path
                          ? "bg-[#6B1E3C] text-[#c9a84c] shadow-md shadow-[#6B1E3C]/40"
                          : "text-slate-300 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      <span
                        className={`${location.pathname === sidebarItem.path ? "text-[#c9a84c]" : "text-[#c9a84c]/60"} transition-colors`}
                      >
                        {sidebarItem.icon}
                      </span>
                      <span className="text-sm tracking-wide">
                        {sidebarItem.text}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Management Section */}
            <div>
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.15em] text-[#c9a84c]/50 uppercase">
                Administration
              </p>
              <div className="rounded-lg border border-white/8 bg-white/4 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setManagementOpen((prev) => !prev)}
                  aria-expanded={managementOpen}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                    userManagementActive
                      ? "bg-[#6B1E3C] text-[#c9a84c]"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span
                      className={`${userManagementActive ? "text-[#c9a84c]" : "text-[#c9a84c]/60"}`}
                    >
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
                          d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 11a4 4 0 100-8 4 4 0 000 8z"
                        />
                      </svg>
                    </span>
                    <span>User Management</span>
                  </span>
                  <span
                    className={`transition-transform duration-200 ${managementOpen ? "rotate-180" : "rotate-0"}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                {managementOpen && (
                  <ul className="py-1.5 space-y-0.5 font-medium border-t border-white/8">
                    {userManagementItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.path}
                          onClick={() =>
                            window.innerWidth < 640 && toggleSidebar()
                          }
                          className={`flex items-center gap-3 px-4 py-2.5 pl-11 transition-all duration-200 ${
                            isActive(item.path)
                              ? "bg-[#c9a84c]/15 text-[#c9a84c] border-l-2 border-[#c9a84c]"
                              : "text-slate-400 hover:bg-white/6 hover:text-slate-200 border-l-2 border-transparent"
                          }`}
                        >
                          <span
                            className={`${isActive(item.path) ? "text-[#c9a84c]" : "text-slate-500"} transition-colors`}
                          >
                            {item.icon}
                          </span>
                          <span className="text-sm tracking-wide">
                            {item.text}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Laboratory Management Section */}
            <div>
              <div className="rounded-lg border border-white/8 bg-white/4 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setLaboratoryOpen((prev) => !prev)}
                  aria-expanded={laboratoryOpen}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                    laboratoryManagementActive
                      ? "bg-[#6B1E3C] text-[#c9a84c]"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span
                      className={`${laboratoryManagementActive ? "text-[#c9a84c]" : "text-[#c9a84c]/60"}`}
                    >
                      {/* Laboratory Section Header Icon */}
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
                          d="M9 3v10.382a1 1 0 01-.276.692l-4.448 4.672A1 1 0 005 20h14a1 1 0 00.724-1.69l-4.448-4.672A1 1 0 0115 13.382V3m-6 0h6M9 3H7m8 0h2"
                        />
                      </svg>
                    </span>
                    <span>Laboratory Management</span>
                  </span>
                  <span
                    className={`transition-transform duration-200 ${laboratoryOpen ? "rotate-180" : "rotate-0"}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                {laboratoryOpen && (
                  <ul className="py-1.5 space-y-0.5 font-medium border-t border-white/8">
                    {laboratoryManagementItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.path}
                          onClick={() =>
                            window.innerWidth < 640 && toggleSidebar()
                          }
                          className={`flex items-center gap-3 px-4 py-2.5 pl-11 transition-all duration-200 ${
                            isActive(item.path)
                              ? "bg-[#c9a84c]/15 text-[#c9a84c] border-l-2 border-[#c9a84c]"
                              : "text-slate-400 hover:bg-white/6 hover:text-slate-200 border-l-2 border-transparent"
                          }`}
                        >
                          <span
                            className={`${isActive(item.path) ? "text-[#c9a84c]" : "text-slate-500"} transition-colors`}
                          >
                            {item.icon}
                          </span>
                          <span className="text-sm tracking-wide">
                            {item.text}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
