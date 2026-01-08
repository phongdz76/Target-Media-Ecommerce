import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import AdminPage from "./pages/admin/AdminPage";
import UserPage from "./pages/user/UserPage";
import ProductDetail from "./pages/user/ProductDetail";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({
  element,
  requiredRole,
}: {
  element: React.ReactElement;
  requiredRole?: "admin" | "user";
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to their respective dashboard
    return (
      <Navigate to={user?.role === "admin" ? "/admin" : "/user"} replace />
    );
  }

  return element;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute element={<AdminPage />} requiredRole="admin" />
          }
        />

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute element={<UserPage />} requiredRole="user" />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute element={<ProductDetail />} requiredRole="user" />
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
