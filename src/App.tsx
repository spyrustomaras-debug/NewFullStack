import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import WorkerDashboard from "../src/pages/WorkerDashboard";
import AdminDashboard from "../src/pages/AdminDashboard";
import ProtectedRoute from "../src/routes/ProtectedRoute";
import { useEffect } from "react";
import { refreshAccessToken } from "./utils/auth";

function App() {

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     await refreshAccessToken();
  //   }, 4 * 60 * 1000); // refresh every 4 minutes

  //   return () => clearInterval(interval); // cleanup on unmount
  // }, []);


  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Worker-only routes */}
        <Route
          path="/worker-dashboard"
          element={
            <ProtectedRoute allowedRoles={["WORKER"]}>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
