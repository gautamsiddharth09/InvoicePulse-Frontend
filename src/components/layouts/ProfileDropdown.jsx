import React from "react";
import { ChevronDown, User, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative inline-block text-left">
      {/* Profile Button */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full border cursor-pointer transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20
          ${
            isOpen
              ? "bg-gray-50 border-gray-300/80 shadow-sm"
              : "bg-white/80 border-gray-200/60 hover:bg-gray-50/80 hover:border-gray-300/60 hover:shadow-sm"
          }`}
      >
        {/* Avatar */}
        <div className="relative shrink-0 ">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#F28C38]  flex items-center justify-center shadow-sm shadow-indigo-200">
              <span className="text-white font-semibold text-sm tracking-wider">
                {companyName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}
          {/* active dot */}
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        {/* User information */}
        <div className="hidden sm:block text-left max-w-30">
          <p className="text-xs font-semibold text-gray-900 truncate tracking-tight leading-tight">
            {companyName}
          </p>
          <p className="text-[11px] font-medium text-gray-600 truncate mt-0.5">
            {email}
          </p>
        </div>

        {/* Chevron Icon transition */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180 text-gray-600" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-50 origin-top-right bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"  onClick={(e) => e.stopPropagation()}>
          
          {/* Header section */}
          <div className="relative px-5 py-4 bg-linear-to-b from-gray-50/50 to-white border-b border-gray-100">
            <div className="flex items-center gap-1.5 mb-1">
              <p className="font-semibold text-sm text-gray-900 tracking-tight">
                {companyName}
              </p>
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-xs  font-medium text-gray-600 truncate">
              {email}
            </p>
          </div>

          {/* Menu Actions */}
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={() => navigate("profile")}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium cursor-pointer text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group"
            >
              <User className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
              <span>View Profile</span>
            </button>
          </div>

          {/* Logout Section */}
          <div className="p-1.5 border-t border-gray-100 bg-gray-50/40">
            <button
              onClick={onLogout}
              className="w-full flex items-center cursor-pointer gap-3 px-3.5 py-2.5 text-xs font-semibold text-red-600 rounded-xl hover:bg-red-50/60 transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform duration-200" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;