import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = login(email, password);

    if (success) {
      // Lấy user từ localStorage để check role
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }
    } else {
      setError("Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Taget Media</h1>
            <p>Login to continue</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="btn-login">
              Login
            </button>
          </form>

          {/* <div className="demo-info">
            <h3>Tài khoản Demo:</h3>
            <div className="demo-item">
              <strong>Admin:</strong>
              <code>admin@admin.com / admin123</code>
            </div>
            <div className="demo-item">
              <strong>User:</strong>
              <code>user@user.com / user123</code>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
