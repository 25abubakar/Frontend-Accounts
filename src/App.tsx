import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Layouts & Protection
import ProtectedRoute from "./components/shared/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Auth Pages
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";

// Feature Pages
import OrgTreeTable from "./pages/OrgTreeTable"; // Make sure this path matches where you saved it!

const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // PROTECTED ROUTES (Requires Authentication)
  {
    element: <ProtectedRoute />, 
    children: [
      {
        element: <DashboardLayout />, 
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "/dashboard",
            element: (
              <div>
                <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                <p className="mt-4 text-slate-400">Welcome to the LAL Group Master Portal.</p>
              </div>
            ),
          },
          {
            path: "/groups",
            element: (
              <div>
                <h1 className="text-3xl font-bold">Master Directory</h1>
                <p className="mt-4 text-slate-400">Select a sub-category from the sidebar to manage entities.</p>
              </div>
            ),
          },
          // ==========================================
          // NEW ROUTE: Companies & Entities Table
          // ==========================================
          {
            path: "/groups/companies",
            element: <OrgTreeTable />,
          },
          {
            path: "/settings",
            element: (
              <div>
                <h1 className="text-3xl font-bold">System Settings</h1>
              </div>
            ),
          },
        ],
      },
    ],
  },
  
  // FALLBACK (Redirects unknown paths to dashboard)
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}