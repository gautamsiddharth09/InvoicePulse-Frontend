import { useDispatch } from "react-redux";
import { resetPassword } from "../../features/authSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

const ResetPassword = () => {

  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // reset password
  const handleReset = async () => {
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await dispatch(
        resetPassword({ token, password })
      ).unwrap();

      toast.success(res.message || "Password reset successful");
      navigate("/login");

    } catch (err) {
      toast.error(err || "Reset failed");
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-[#55636A] px-4">

  <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

    <h2 className="text-2xl font-bold text-white text-center mb-6">
      Reset Password
    </h2>

    {/* New Password */}
    <div className="mb-4">
      <label className="text-gray-200 text-sm">New Password</label>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12D6C3]"
      />
    </div>

    {/* Confirm Password */}
    <div className="mb-6">
      <label className="text-gray-200 text-sm">Confirm Password</label>
      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12D6C3]"
      />
    </div>

    {/* Button */}
    <button
      onClick={handleReset}
      className="w-full bg-[#12D6C3] text-white py-3 rounded-xl font-semibold hover:bg-[#0FC0AF] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
    >
      Reset Password
    </button>

  </div>
</div>
  );
};

export default ResetPassword;