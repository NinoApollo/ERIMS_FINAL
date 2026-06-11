import { useNavigate } from "react-router-dom";
import { useHeader } from "../context/HeaderContext";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, type FormEvent } from "react";

const AppHeader = () => {
  const { isOpen, toggleUserMenu } = useHeader();
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      await logout();
      navigate("/");
    } catch (error) {
      console.error(
        "Unexpected server error occured during logging user out: ",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserFullNameFormat = () => {
    if (!user) return "";

    let fullName = `${user.user.last_name}, ${user.user.first_name}`;

    if (user.user.middle_name) {
      fullName += ` ${user.user.middle_name.charAt(0)}.`;
    }

    if (user.user.suffix_name) {
      fullName += ` ${user.user.suffix_name}`;
    }

    return fullName;
  };

  const userInitials = () => {
    if (!user) return "";
    return `${user.user.first_name?.charAt(0) || ""}${user.user.last_name?.charAt(0) || ""}`.toUpperCase();
  };

  useEffect(() => {
    if (user) {
      handleUserFullNameFormat();
    }
  }, [user]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
          onClick={toggleUserMenu}
        />
      )}
      <nav className="fixed top-0 z-50 w-full bg-[#111827] border-b border-white/10">
        <div className="px-4 py-3 lg:px-6 lg:pl-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end gap-3">
              <button
                data-drawer-target="top-bar-sidebar"
                data-drawer-toggle="top-bar-sidebar"
                aria-controls="top-bar-sidebar"
                type="button"
                onClick={toggleSidebar}
                className="sm:hidden text-slate-200 rounded-lg border border-white/10 hover:bg-white/10 focus:ring-2 focus:ring-white/20 font-medium leading-5 text-sm p-2.5 transition-all duration-200 focus:outline-none"
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
              <div className="flex items-center gap-3">
                <img
                  src="src/assets/img/ChtmLogo.png"
                  alt="FCU-CHTM Logo"
                  className="w-9 h-9 object-contain rounded"
                />
                <div className="flex flex-col">
                  <span className="hidden md:block text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase leading-none mb-0.5">
                    FCU-CHTM
                  </span>
                  <span className="self-center text-sm font-bold tracking-wide text-white md:text-base leading-tight">
                    Equipment and Laboratory Resource Management
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    onClick={toggleUserMenu}
                    className="flex text-sm rounded-full ring-2 ring-white/20 hover:ring-white/40 focus:ring-4 focus:ring-white/20 transition-all duration-200"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open user menu</span>
                    {user?.user.profile_picture ? (
                      <img
                        className="w-9 h-9 rounded-full object-cover border border-white/20"
                        src={user.user.profile_picture}
                        alt={handleUserFullNameFormat()}
                      />
                    ) : (
                      <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white border border-white/20">
                        {userInitials()}
                      </span>
                    )}
                  </button>
                </div>
                <div
                  className={`absolute right-6 top-14 min-w-56 z-50 ${isOpen ? "block animate-fadeIn" : "hidden"} bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden`}
                  id="dropdown-user"
                >
                  <div
                    className="px-5 py-4 bg-slate-900 border-b border-slate-200"
                    role="none"
                  >
                    <p
                      className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-0.5"
                      role="none"
                    >
                      Signed in as
                    </p>
                    <p
                      className="text-sm font-bold text-white truncate"
                      role="none"
                    >
                      {handleUserFullNameFormat()}
                    </p>
                  </div>
                  <ul
                    className="py-2 text-sm text-slate-700 font-medium"
                    role="none"
                  >
                    <li>
                      <button
                        type="submit"
                        className="flex items-center gap-2.5 w-full text-start px-5 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        role="menuitem"
                        onClick={handleLogout}
                        disabled={isLoading}
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
                        {isLoading ? "Signing Out..." : "Sign Out"}
                      </button>
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
