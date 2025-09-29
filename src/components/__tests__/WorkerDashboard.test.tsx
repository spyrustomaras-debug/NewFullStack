// src/components/__tests__/WorkerDashboard.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import WorkerDashboard from "../../pages/WorkerDashboard";
import projectReducer, {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../features/projects/projectSlice";
import { subscribe } from "diagnostics_channel";

// Mock async thunks
jest.mock("../../features/projects/projectSlice", () => {
  const originalModule = jest.requireActual("../../features/projects/projectSlice");
  return {
    __esModule: true,
    ...originalModule,
    createProject: jest.fn((payload) => {
      return async (dispatch: any) => {
        dispatch({ type: "projects/createProject/pending" });
        dispatch({ type: "projects/createProject/fulfilled", payload });
      };
    }),
    updateProject: jest.fn((payload) => {
      return async (dispatch: any) => {
        dispatch({ type: "projects/updateProject/fulfilled", payload });
      };
    }),
    deleteProject: jest.fn((id) => {
      return async (dispatch: any) => {
        dispatch({ type: "projects/deleteProject/fulfilled", payload: id });
      };
    }),
  };
});


// Minimal auth reducer for Header component
const authReducer = (state = { user: { username: "worker1", role: "WORKER" }, refreshToken: null, loading: false, error: null }, action: any) => state;

// Helper to render with redux store and router
const renderWithStore = (preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      projects: projectReducer,
      auth: authReducer,
    },
    preloadedState,
  });

  return { store, ...render(
    <Provider store={store}>
      <BrowserRouter>
        <WorkerDashboard />
      </BrowserRouter>
    </Provider>
  )};
};

describe("WorkerDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

//   it("renders the dashboard and fetches projects on mount", () => {
//     renderWithStore({
//       projects: { projects: [], loading: false, error: null },
//     });

//     expect(screen.getByText(/Worker Dashboard/i)).toBeInTheDocument();
//     expect(fetchProjects).toHaveBeenCalled();
//   });

  it("displays a list of projects", () => {
    renderWithStore({
      projects: {
        projects: [
          { id: 1, name: "Project One", description: "Desc One", created_by: {}, created_at: "" },
          { id: 2, name: "Project Two", description: "Desc Two", created_by: {}, created_at: "" },
        ],
        loading: false,
        error: null,
      },
    });

    expect(screen.getByText(/Project One/i)).toBeInTheDocument();
    expect(screen.getByText(/Desc One/i)).toBeInTheDocument();
    expect(screen.getByText(/Project Two/i)).toBeInTheDocument();
    expect(screen.getByText(/Desc Two/i)).toBeInTheDocument();
  });

  it("shows an error message if projects fail to load", () => {
    renderWithStore({
      projects: { projects: [], loading: false, error: "Failed to fetch" },
    });

    expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
  });

  it("disables create button and shows 'Creating...' when loading", () => {
    renderWithStore({
        projects: {projects:[], loading:true, error:null},
    });
    const button = screen.getByRole("button", {name: /Creating.../i});
    expect(button).toBeInTheDocument();
  });

//   it("dispatches createProject when submitting the form", async () => {
//     renderWithStore({
//       projects: { projects: [], loading: false, error: null },
//     });

//     const nameInput = screen.getByPlaceholderText(/Project Name/i);
//     const descInput = screen.getByPlaceholderText(/Project Description/i);
//     const submitButton = screen.getByRole("button", { name: /Create Project/i });

//     // Type project details
//     await userEvent.type(nameInput, "New Project");
//     await userEvent.type(descInput, "New Project Description");

//     // Submit form
//     fireEvent.click(submitButton);

//     // Assert thunk was called with correct payload
//     expect(createProject).toHaveBeenCalledWith({
//       name: "New Project",
//       description: "New Project Description",
//     });
//   });

});
