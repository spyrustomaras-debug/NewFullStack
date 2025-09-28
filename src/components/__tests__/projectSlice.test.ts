// src/features/projects/__tests__/projectSlice.test.ts
import reducer, {
  ProjectState,
  createProject,
  fetchProjects,
  updateProject,
  deleteProject,
  clearProjects,
  Project,
} from "../../features/projects/projectSlice";
import { AnyAction } from "@reduxjs/toolkit";
import axios from "axios";

jest.mock("axios"); // Uses your manual mock from __mocks__/axios

describe("projectSlice reducer", () => {
  const initialState: ProjectState = {
    projects: [],
    loading: false,
    error: null,
  };

  const sampleProject: Project = {
    id: 1,
    name: "Test Project",
    description:"Description",
    created_by: { id: 1, username:"user", email:"email@gmail.com", role:"Worker" },
    created_at: new Date().toISOString(),
  };

  it("should handle initial state", () => {
    expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  it("should handle clear projects action", ()=> {
    const state: ProjectState = {
        projects:[sampleProject],
        loading: false,
        error:"Some error",
    }
    const nextState = reducer(state, clearProjects());
    expect(nextState.projects).toEqual([]);
    expect(nextState.error).toBeNull();
  });

  it("should handle createProject.fulfilled", () => {
    const action = { type: createProject.fulfilled.type, payload: sampleProject };
    const nextState = reducer(initialState, action);
    expect(nextState.projects).toEqual([sampleProject]);
    expect(nextState.loading).toBe(false);
  })

  it("should handle createProject.rejected", () => {
    const action = { type: createProject.rejected.type, payload: "Failed" };
    const nextState = reducer(initialState, action);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe("Failed")
  });

  it("should handle deleteProject.fulfilled", () => {
    const state: ProjectState = {...initialState, projects:[sampleProject]};
    const action = { type: deleteProject.fulfilled.type, payload: 1 };
    const nextState = reducer(state, action);
    expect(nextState.projects).toEqual([]);
  });

  it("should handle updateProject.fulfilled", () => {
    const updatedProject = {...sampleProject, name:"Updated Name"};
    const state: ProjectState = { ...initialState, projects:[sampleProject] };
    const action = { type: updateProject.fulfilled.type, payload: updatedProject };
    const nextState = reducer(state, action);
    expect(nextState.projects[0].name).toBe("Updated Name")
  });

  it("should handle fetchProjects.fulfilled", () => {
    const action = { type: fetchProjects.fulfilled.type, payload:[sampleProject] };
    const nextState = reducer(initialState, action);
    expect(nextState.projects).toEqual([sampleProject]);
  });
});
