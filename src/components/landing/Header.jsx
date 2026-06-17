import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import ProfileDropdown from "../layouts/ProfileDropdown";
import { logoutUser } from "../../features/authSlice";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(false);
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  

  // Logout
  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#2F3B42]/95 backdrop-blur-md border-b border-[#12D6C3]/20 shadow-lg"
          : "bg-[#4A585F]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-[#12D6C3] p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>

            <span className="text-white font-bold text-2xl">
              AI Invoice App
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-lg font-medium text-gray-100 hover:text-[#12D6C3] transition-colors duration-200"
            >
              Features
            </a>

            <a
              href="#testimonials"
              className="text-lg font-medium text-gray-100 hover:text-[#12D6C3] transition-colors duration-200"
            >
              Testimonials
            </a>

            <a
              href="#faq"
              className="text-lg font-medium text-gray-100 hover:text-[#12D6C3] transition-colors duration-200"
            >
              FAQ
            </a>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                companyName={user?.name || ""}
                email={user?.email || ""}
                onLogout={handleLogout}
              />
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-100 hover:text-[#12D6C3]"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-5 py-2 bg-[#F28C38] text-white rounded-lg hover:bg-[#E67E22] transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen((prev) => !prev);
                }}
                companyName={user?.businessName || user?.name || ""}
                email={user?.email || ""}
                onLogout={handleLogout}
              />
            ) : (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-[#4A585F] rounded-xl border border-white/10 shadow-lg p-5 mb-4">
            <div className="flex flex-col space-y-5">
              <a
                href="#features"
                onClick={closeMenu}
                className="text-gray-100 hover:text-[#12D6C3]"
              >
                Features
              </a>

              <a
                href="#testimonials"
                onClick={closeMenu}
                className="text-gray-100 hover:text-[#12D6C3]"
              >
                Testimonials
              </a>

              <a
                href="#faq"
                onClick={closeMenu}
                className="text-gray-100 hover:text-[#12D6C3]"
              >
                FAQ
              </a>
            </div>

            <div className="border-t border-white/15 my-5"></div>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  navigate("/dashboard");
                  closeMenu();
                }}
                className="w-full py-3 bg-[#12D6C3] hover:bg-[#0FC0AF] text-white font-medium rounded-lg transition-colors duration-300"
              >
                Go to Dashboard
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full py-3 text-center border border-[#12D6C3] text-[#12D6C3] rounded-lg hover:bg-[#12D6C3]/10 transition-colors duration-300"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="w-full py-3 text-center bg-[#12D6C3] hover:bg-[#0FC0AF] text-white rounded-lg transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
