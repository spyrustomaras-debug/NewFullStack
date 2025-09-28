// src/features/projects/projectSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Project {
  id: number;
  name: string;
  description: string;
  created_by: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  created_at: string;
}

export interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

// Delete project
export const deleteProject = createAsyncThunk<number, number>(
  "projects/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`http://127.0.0.1:8000/api/projects/${projectId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return projectId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to delete project");
    }
  }
);

// Update project
export const updateProject = createAsyncThunk<
  Project,
  { id: number; name: string; description: string }
>(
  "projects/updateProject",
  async ({ id, name, description }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.put(
        `http://127.0.0.1:8000/api/projects/${id}/`,
        { name, description },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to update project");
    }
  }
);

// Create Project (Worker only)
export const createProject = createAsyncThunk<Project, { name: string; description: string }>(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/projects/",
        projectData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to create project");
    }
  }
);

// fetch projects (for both admin and worker)
export const fetchProjects = createAsyncThunk<Project[]>(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("http://127.0.0.1:8000/api/projects/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data; // backend already filters by worker or returns all for admin
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch projects");
    }
  }
);



const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: { clearProjects: (state) => { state.projects = []; state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createProject.fulfilled, (state, action) => { state.loading = false; state.projects.push(action.payload); })
      .addCase(createProject.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<number>) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.projects[index] = action.payload;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.projects = action.payload;
      });
  },
});


export const { clearProjects } = projectSlice.actions;
export default projectSlice.reducer;
