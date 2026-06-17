import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./pages/landingPage/LandingPage";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard"
import AllInovice from "./pages/Inovices/AllInovice"
import InoviceDetails from "./pages/Inovices/InoviceDetails"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import ProfilePage from "./pages/profile/ProfilePage"
import CreateInvoice from "./pages/Inovices/CreateInvoice";
import ResetPassword from "./pages/Auth/ResetPassword";
import { loadUser } from "./features/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";


const App = () => {

 const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  
  return (
    <div>
      <Router>
         <ToastContainer position="top-center" style={{ zIndex: 99999 }} autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="invoices" element={<AllInovice />} />
            <Route path="invoices/new" element={<CreateInvoice />} />

            <Route path="invoices/edit/:id" element={<CreateInvoice />} />
            
            <Route path="invoices/:id" element={<InoviceDetails />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  ); 
};

export default App;
