import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  fetchProjects,
  deleteProject,
  updateProject,
  Project,
  resetProjects
} from "../features/projects/projectSlice";
import { RootState, AppDispatch } from "../app/store";
import Header from "../components/Header";
import "./WorkerDashboard.css";

const WorkerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, projects } = useSelector((state: RootState) => state.projects);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if(projects.length === 0) dispatch(fetchProjects());
  }, [dispatch, projects.length]);

  // Open update modal
  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description);
    setShowUpdateModal(true);
  };

  // Open delete modal
  const handleDeleteClick = (id: number) => {
    setDeleteProjectId(id);
    setShowDeleteModal(true);
  };

  const handleUpdate = async () => {
    if (editingProject) {
      await dispatch(updateProject({ id: editingProject.id, name, description }));
      setShowUpdateModal(false);
      setEditingProject(null);
      setName("");
      setDescription("");
    }
  };

  const handleDelete = async () => {
    if (deleteProjectId) {
      await dispatch(deleteProject(deleteProjectId));
      setShowDeleteModal(false);
      setDeleteProjectId(null);
    }
  };

  return (
    <div>
      <Header />
      <div className="dashboard-container">
        <h2>Worker Dashboard</h2>

        {/* Create Project Form */}
        <form className="project-form" onSubmit={async (e) => {
          e.preventDefault();
          await dispatch(createProject({ name, description }));
          setName("");
          setDescription("");
        }}>
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
        {error && <p className="error">{error}</p>}

        <h3>Your Projects:</h3>
        <ul>
            {projects.length === 0 ? (
                <p>No projects created yet.</p>
            ) : (
                projects.map((project) => (
                <li key={project.id}>
                    <div className="project-info">
                        <strong>{project.name}</strong>: {project.description}
                    </div>
                    <div className="project-actions">
                        <button onClick={() => handleEditClick(project)}>Edit</button>
                        <button onClick={() => handleDeleteClick(project.id)}>Delete</button>
                    </div>
                </li>
                ))
            )}
        </ul>


        {/* Update Modal */}
        {showUpdateModal && editingProject && (
          <div className="modal">
            <div className="modal-content">
              <h3>Update Project</h3>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project Name"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project Description"
              />
              <div className="modal-actions">
                <button onClick={handleUpdate}>Update</button>
                <button onClick={() => setShowUpdateModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this project?</p>
              <div className="modal-actions">
                <button onClick={handleDelete}>Yes, Delete</button>
                <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;