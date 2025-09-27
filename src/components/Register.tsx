// src/components/Register.tsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import { RootState, AppDispatch } from "../app/store";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css"; // Separate CSS file

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("WORKER");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register({ username, email, password, role }));

    if (register.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="WORKER">Worker</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
         <p className="redirect-login">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
