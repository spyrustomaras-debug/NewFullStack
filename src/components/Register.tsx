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

  // validation errors
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { username?: string; email?: string; password?: string } = {};
    if (!username.trim()) errors.username = "Username is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email address";
    if (!password.trim()) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;


    const result = await dispatch(register({ username, email, password, role }));

    if(result.type === "auth/register/fulfilled"){
      navigate("/login")
    }

    // if (register.fulfilled.match(result)) {
    //   navigate("/login");
    // }
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
            onChange={(e) => {
              setUsername(e.target.value);
              if(validationErrors.username){
                setValidationErrors((prev) => ({...prev, username: undefined}))
              }
            }}
          />
          {validationErrors.username && (
            <p className="input-error">Username is required</p>
          )}

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if(validationErrors.email){
                setValidationErrors((prev) => ({
                  ...prev, email:undefined
                }))
              }
            }}
          />
          {validationErrors.email && (
            <p className="input-error">{validationErrors.email}</p>
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
          {
            validationErrors.password && (
              <p className="input-error">{validationErrors.password}</p>
            )
          }

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
