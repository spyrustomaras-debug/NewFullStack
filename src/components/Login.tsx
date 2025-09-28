// src/components/Login.tsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { RootState, AppDispatch } from "../app/store";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [validationErrors, setValidationErrors] = useState<{username?:string, password?: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // simple client side validation
    const errors: {username?: string; password?: string} = {};
    if(!username.trim()) errors.username = "Username is required";
    if(!password.trim()) errors.password = "Password is required";

    setValidationErrors(errors);

    if(Object.keys(errors).length > 0) return; // Stop if validation fails

    const result = await dispatch(login({ username, password }));

    if (result.type === "auth/login/fulfilled") {
      const payload = result.payload as { role: string }; // ✅ type assertion
      if (payload.role === "WORKER") navigate("/worker-dashboard");
      else if (payload.role === "ADMIN") navigate("/admin-dashboard");
    }
  };


  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if(validationErrors.username){
                setValidationErrors((prev) => ({...prev, username: undefined}))
              }
            }}
          />
          {validationErrors.username && (
            <p className="input-error">{validationErrors.username}</p>
          )}
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if(validationErrors.password) {
                setValidationErrors((prev) => ({...prev, password:undefined}))
              }
            }}
          />
          {validationErrors.password && (
            <p className="input-error">{validationErrors.password}</p>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="redirect-login">
            Do not have an account?{" "}
            <Link to="/register" className="login-link">
                Register here
            </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
