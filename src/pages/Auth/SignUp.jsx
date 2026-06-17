// pages/Register.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  removeErrors,
  removeSuccess,
} from "../../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  // Handle Change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill out all required fields", {
        position: "top-center",
      });
      return;
    }

    await dispatch(registerUser(formData));
  };

  // Error Toast
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });

      dispatch(removeErrors());
    }
  }, [error, dispatch]);
  // Success Toast
  useEffect(() => {
    if (success) {
      toast.success("Registration Successful", {
        position: "top-center",
        autoClose: 3000,
      });

      dispatch(removeSuccess());

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, [success, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-[#55636A] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            AI Invoice Generator
          </h1>

          <p className="text-gray-300 mt-2">Create smarter invoices with AI</p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-200 mb-2">Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12D6C3]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-200 mb-2">Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12D6C3]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-200 mb-2">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12D6C3]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#12D6C3] transition cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#12D6C3] text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#12D6C3]/40 hover:scale-[1.02] disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-300">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#F28C38] font-semibold cursor-pointer hover:underline"
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
