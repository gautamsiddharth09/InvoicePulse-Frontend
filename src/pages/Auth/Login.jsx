// pages/Login.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { removeErrors, removeSuccess,loginUser, forgotPassword } from "../../features/authSlice";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // submit login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      loginUser({ email: loginEmail, password: loginPassword }),
    );

    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  // handle forgot password
  const handleForgotPassword = async () => {
  if (!forgotEmail.trim()) {
    return toast.error("Please enter your email");
  }

  try {
    const result = await dispatch(
      forgotPassword(forgotEmail)
    ).unwrap();

    toast.success(result.message);

    console.log("Reset URL:", result.resetUrl);

    setShowForgotModal(false);

  } catch (error) {
    toast.error(error);
  }
};

  // success handling
  useEffect(() => {
    if (success) {
      toast.success("Login Successful", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);

  // error handling toast
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });

      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  return (
    <div className="min-h-screen bg-[#55636A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            AI Invoice Generator
          </h1>
          <p className="text-gray-300 mt-2">Welcome back, login to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">
            Login
          </h2>

          {/* form data */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-200 mb-2">Email</label>

              <input
                type="email"
                name="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12D6C3]"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-200">Password</label>
                {/* forgot password */}
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-[#12D6C3] hover:text-[#0FC0AF] hover:underline transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12D6C3]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#12D6C3]"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#12D6C3] text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#12D6C3]/40 hover:scale-[1.02] disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-300 mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-[#F28C38] font-semibold cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>

      {/* forgot password */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-9999">
          <div className="bg-[#55636A] w-full max-w-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-2">
              Reset Password
            </h2>

            <p className="text-gray-300 text-sm mb-4">
              Enter your registered email address.
            </p>

            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12D6C3]"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotEmail("");
                }}
                className="px-4 py-2 text-gray-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="px-4 py-2 bg-[#12D6C3] text-white rounded-lg hover:bg-[#0FC0AF] cursor-pointer"
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
