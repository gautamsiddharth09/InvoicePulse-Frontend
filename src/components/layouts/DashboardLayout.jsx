// components/layouts/DashboardLayout.jsx

import { useEffect, useState } from "react";
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Plus
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProfileDropdown from "./ProfileDropdown";
import { logoutUser } from "../../features/authSlice"; // adjust path if needed

function DashboardLayout({ children }) {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // window dropdown handling
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;

      setIsMobile(mobile);

      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdown) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileDropdown]);

  // toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // handle logout
  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300
        ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl">
            <Briefcase className="w-6 h-6 text-[#12D6C3]" />
            <span>AI Invoice</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <NavLink
            to="/dashboard"
            end
             onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#12D6C3] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/invoices"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#12D6C3] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <FileText size={18} />
            Invoices
          </NavLink>

          <NavLink
            to="invoices/new"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#12D6C3] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Plus size={18} />
            Create Invoice
          </NavLink>

          <NavLink
            to="profile"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#12D6C3] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <User size={18} />
            Profile
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-5 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile  */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button onClick={toggleSidebar}>
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}

            <div>
             <h1 className="font-semibold text-base sm:text-lg md:text-xl truncate">
                Welcome back, {user?.businessName || user?.name}
              </h1>

              <p className="text-sm text-gray-500">
                Manage your invoices efficiently
              </p>
            </div>
          </div>

          {/* Profile */}
          <div className="relative">
            <ProfileDropdown
              isOpen={profileDropdown}
              onToggle={(e) => {
                e.stopPropagation();
                setProfileDropdown((prev) => !prev);
              }}
              companyName={user?.businessName || user?.name}
              email={user?.email}
              onLogout={handleLogout}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;


// text-gray-600 hover:bg-gray-100