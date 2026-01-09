import {
  HashRouter as Router,
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
    return (
      <Navigate to={user?.role === "admin" ? "/admin" : "/user"} replace />
    );
  }

  return element;
};

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to={user?.role === "admin" ? "/admin" : "/user"}
                replace
              />
            ) : (
              <Login />
            )
          }
        />

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

        {/* Default Route - Redirect based on auth status and role */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/user" replace />
            )
          }
        />

        {/* Catch all - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;