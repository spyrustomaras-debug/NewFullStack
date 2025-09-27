import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../features/projects/projectSlice";
import { RootState, AppDispatch } from "../app/store";
import Header from "../components/Header";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div>
      <Header />
      <div className="dashboard-container">
        <h2>Admin Dashboard</h2>

        {loading && <p>Loading projects...</p>}
        {error && <p className="error">{error}</p>}

        <h3>All Projects:</h3>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.name}</strong> - {project.description} <br />
              <small>
                Created by: {project.created_by.username} ({project.created_by.role})
              </small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
