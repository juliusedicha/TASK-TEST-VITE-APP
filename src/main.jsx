import React, { useEffect } from "react";
import { AuthContext } from "./authContext";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SnackBar from "./components/SnackBar";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function Main() {
  const { state, dispatch } = React.useContext(AuthContext);
  const navigate = useNavigate(); // Hook for navigation


  // Effect to check authentication status on page load
  useEffect(() => {
    // Check if authentication token exists in localStorage
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      // Dispatch action to set authentication state
      dispatch({ type: "LOGIN_SUCCESS", payload: { token: authToken } });
    }
  }, [dispatch]);

  // Effect to show login success Snackbar
  useEffect(() => {
    if (state.isAuthenticated) {
      // Show Snackbar or toast message here
      // Dispatch an action to set the Snackbar message in your state
      dispatch({ type: "SET_SNACKBAR_MESSAGE", payload: "Login successful!" });
    }
  }, [state.isAuthenticated, dispatch]);

  return (
    <div className="h-full">
      <div className="flex w-full">
        <div className="w-full">
          <div className="page-wrapper w-full py-10 px-5">
            <Routes>
              {/* Redirect to AdminDashboardPage if authenticated */}
              {state.isAuthenticated && state.role === "admin" ? (
                <Route path="/" element={<Navigate to="/pages/dashboard" />} />
              ) : null}

              {/* Define your routes */}
              <Route path="/pages/dashboard" element={<AdminDashboardPage />} />
              <Route path="/" element={<AdminLoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>

          
          </div>
        </div>
      </div>
      {state.isAuthenticated && <SnackBar />} {/* Render Snackbar component only if authenticated */}
    </div>
  );
}

export default Main;
