import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const AppSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const location = useLocation();
  const [managementOpen, setManagementOpen] = useState(false);
  const [laboratoryOpen, setLaboratoryOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [requestFormOpen, setRequestFormOpen] = useState(false);

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
    {
      path: "/activity-logs",
      text: "Activity Logs",
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const userManagementItems = [
    {
      path: "/students",
      text: "Students",
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
    {
      path: "/personnels",
      text: "Personnels",
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
            d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z"
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
      path: "/genders",
      text: "Genders",
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
            d="M16.5 5.5a2 2 0 11-4 0 2 2 0 014 0zm-7.5 4a2 2 0 11-4 0 2 2 0 014 0zm9 7a2 2 0 11-4 0 2 2 0 014 0zm-9 4a2 2 0 11-4 0 2 2 0 014 0z"
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
    {
      path: "/areas",
      text: "Areas",
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
            d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"
          />
        </svg>
      ),
    },
  ];

  const inventoryManagementItems = [
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
    {
      path: "/equipments",
      text: "Equipment",
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const requestFormManagementItems = [
    {
      path: "/request-form",
      text: "Request Forms",
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6M9 16h6"
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

  const inventoryManagementActive = inventoryManagementItems.some((item) =>
    isActive(item.path),
  );

  const requestFormManagementActive = requestFormManagementItems.some((item) =>
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

  useEffect(() => {
    if (inventoryManagementActive) {
      setInventoryOpen(true);
    }
  }, [inventoryManagementActive]);

  useEffect(() => {
    if (requestFormManagementActive) {
      setRequestFormOpen(true);
    }
  }, [requestFormManagementActive]);

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
        className={`fixed top-0 left-0 z-40 w-72 h-screen pt-16 transition-transform duration-300 ease-in-out shadow-xl ${
          isOpen ? "-translate-x-full" : "translate-x-0"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-5 overflow-y-auto [-ms-overflow-style:none] bg-slate-900 border-r border-white/10">
          <div className="mb-4 px-3">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
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
                  Navigation
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3 px-1">
            <div>
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.15em] text-slate-500 uppercase">
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
                          ? "bg-slate-800 text-white"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span
                        className={`${
                          location.pathname === sidebarItem.path
                            ? "text-white"
                            : "text-slate-500"
                        } transition-colors`}
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
                      className={`${
                        userManagementActive
                          ? "text-[#c9a84c]"
                          : "text-[#c9a84c]/60"
                      }`}
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </span>
                    <span>User Management</span>
                  </span>
                  <span
                    className={`transition-transform duration-200 ${
                      managementOpen ? "rotate-180" : "rotate-0"
                    }`}
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
                            className={`${
                              isActive(item.path)
                                ? "text-[#c9a84c]"
                                : "text-slate-500"
                            } transition-colors`}
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
                      className={`${
                        laboratoryManagementActive
                          ? "text-[#c9a84c]"
                          : "text-[#c9a84c]/60"
                      }`}
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
                          d="M9 3v10.382a1 1 0 01-.276.692l-4.448 4.672A1 1 0 005 20h14a1 1 0 00.724-1.69l-4.448-4.672A1 1 0 0115 13.382V3m-6 0h6M9 3H7m8 0h2"
                        />
                      </svg>
                    </span>
                    <span>Laboratory Management</span>
                  </span>
                  <span
                    className={`transition-transform duration-200 ${
                      laboratoryOpen ? "rotate-180" : "rotate-0"
                    }`}
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
                            className={`${
                              isActive(item.path)
                                ? "text-[#c9a84c]"
                                : "text-slate-500"
                            } transition-colors`}
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

            {/* Inventory Management Section */}
            <div>
              <div className="rounded-lg border border-white/8 bg-white/4 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setInventoryOpen((prev) => !prev)}
                  aria-expanded={inventoryOpen}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                    inventoryManagementActive
                      ? "bg-[#6B1E3C] text-[#c9a84c]"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span
                      className={`${
                        inventoryManagementActive
                          ? "text-[#c9a84c]"
                          : "text-[#c9a84c]/60"
                      }`}
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
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </span>
                    <span>Inventory Management</span>
                  </span>
                  <span
                    className={`transition-transform duration-200 ${
                      inventoryOpen ? "rotate-180" : "rotate-0"
                    }`}
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
                {inventoryOpen && (
                  <ul className="py-1.5 space-y-0.5 font-medium border-t border-white/8">
                    {inventoryManagementItems.map((item, index) => (
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
                            className={`${
                              isActive(item.path)
                                ? "text-[#c9a84c]"
                                : "text-slate-500"
                            } transition-colors`}
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

            {/* Request Form Management Section */}
            <div>
              <div className="rounded-lg border border-white/8 bg-white/4 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setRequestFormOpen((prev) => !prev)}
                  aria-expanded={requestFormOpen}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                    requestFormManagementActive
                      ? "bg-[#6B1E3C] text-[#c9a84c]"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span
                      className={`${
                        requestFormManagementActive
                          ? "text-[#c9a84c]"
                          : "text-[#c9a84c]/60"
                      }`}
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6M9 16h6"
                        />
                      </svg>
                    </span>
                    <span>Request Form Management</span>
                  </span>
                  <span
                    className={`transition-transform duration-200 ${
                      requestFormOpen ? "rotate-180" : "rotate-0"
                    }`}
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
                {requestFormOpen && (
                  <ul className="py-1.5 space-y-0.5 font-medium border-t border-white/8">
                    {requestFormManagementItems.map((item, index) => (
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
                            className={`${
                              isActive(item.path)
                                ? "text-[#c9a84c]"
                                : "text-slate-500"
                            } transition-colors`}
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
