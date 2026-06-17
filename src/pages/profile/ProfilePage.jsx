import React, { useEffect, useState } from "react";
import { Loader2, User, Mail, Building, Phone, MapPin,KeyRound } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import { loadUser, updateProfile } from "../../features/authSlice";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  console.log("user", user)

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    address: "",
    phone: "",
    password: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        businessName: user.businessName || "",
        address: user.address || "",
        phone: user.phone || "",
        password : ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // update profiel
  const handleUpdateProfile = async (e) => {
  e.preventDefault();

  try {
    await dispatch(updateProfile(formData)).unwrap();

    toast.success("Profile updated successfully");
  } catch (error) {
    toast.error(error || "Failed to update profile");
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">

      <h3 className="text-xl font-semibold mb-6">My Profile</h3>

      <form onSubmit={handleUpdateProfile} className="space-y-5">

        {/* Email */}
        <div>
          <label className="text-sm font-medium">Email Address</label>
          <div className="flex items-center gap-2 mt-1 p-2 border rounded bg-gray-100">
            <Mail size={18} />
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <div className="flex items-center gap-2 mt-1 p-2 border rounded bg-gray-100">
            <KeyRound size={18} />
            <input
              type="password"
              name="password"
              value={formData.password}
               onChange={handleInputChange}
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <div className="flex items-center gap-2 mt-1 p-2 border rounded">
            <User size={18} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Business Name */}
        <div>
          <label className="text-sm font-medium">Business Name</label>
          <div className="flex items-center gap-2 mt-1 p-2 border rounded">
            <Building size={18} />
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder="Your business name"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium">Address</label>
          <div className="flex items-start gap-2 mt-1 p-2 border rounded">
            <MapPin size={18} className="mt-1" />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street, City, State, Pincode"
              className="w-full outline-none resize-none h-20"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium">Phone</label>
          <div className="flex items-center gap-2 mt-1 p-2 border rounded">
            <Phone size={18} />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="9876543210"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition cursor-pointer"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;