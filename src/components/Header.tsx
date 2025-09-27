// src/components/Header.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { RootState, AppDispatch } from "../app/store";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-logo">Project Manager</h1>
        <div className="header-user">
          <span className="header-username">{user?.username}</span>
          <button className="header-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
