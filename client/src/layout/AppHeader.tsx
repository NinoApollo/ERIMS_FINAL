import { Link } from "react-router-dom";
import { useHeader } from "../context/HeaderContext";
import { useSidebar } from "../context/SidebarContext";

const AppHeader = () => {
  const { isOpen, toggleUserMenu } = useHeader();
  const { toggleSidebar } = useSidebar();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all duration-300"
          onClick={toggleUserMenu}
        />
      )}
      <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-200">
        <div className="px-4 py-3 lg:px-6 lg:pl-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end gap-3">
              <button
                data-drawer-target="top-bar-sidebar"
                data-drawer-toggle="top-bar-sidebar"
                aria-controls="top-bar-sidebar"
                type="button"
                onClick={toggleSidebar}
                className="sm:hidden text-emerald-700 bg-white rounded-lg shadow-md border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 focus:ring-4 focus:ring-emerald-300 font-medium leading-5 text-sm p-2.5 transition-all duration-200 focus:outline-none"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M5 7h14M5 12h14M5 17h10"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 text-2xl rounded-lg flex items-center justify-center">
                  ♻️
                </div>
                <span className="self-center text-base font-bold tracking-wide text-emerald-800 md:text-lg">
                  FCU - PLASTIC RECYCLING VENDING MACHINE
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    onClick={toggleUserMenu}
                    className="flex text-sm bg-linear-to-r from-emerald-600 to-emerald-700 rounded-full ring-2 ring-emerald-200 hover:ring-emerald-400 focus:ring-4 focus:ring-emerald-300 transition-all duration-200 shadow-md hover:shadow-lg"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-9 h-9 rounded-full border-2 border-white"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="user photo"
                    />
                  </button>
                </div>
                <div
                  className={`absolute right-6 top-12 min-w-55 z-50 ${isOpen ? "block animate-fadeIn" : "hidden"} bg-white rounded-xl shadow-2xl border border-emerald-100 overflow-hidden`}
                  id="dropdown-user"
                >
                  <div
                    className="px-5 py-4 bg-linear-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200"
                    role="none"
                  >
                    <p
                      className="text-sm font-semibold text-emerald-800"
                      role="none"
                    >
                      Neil Sims
                    </p>
                    <p
                      className="text-xs text-emerald-600 truncate mt-0.5"
                      role="none"
                    >
                      neil.sims@flowbite.com
                    </p>
                  </div>
                  <ul
                    className="py-2 text-sm text-emerald-700 font-medium"
                    role="none"
                  >
                    <li>
                      <Link
                        to="#"
                        className="flex items-center gap-2 w-full px-5 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-150"
                        role="menuitem"
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
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AppHeader;
