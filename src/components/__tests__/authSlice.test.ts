import reducer, {
  AuthState,
  login,
  register,
  logout,
  clearError,
} from "../../features/auth/authSlice";
import { AnyAction } from "@reduxjs/toolkit";
import axios from "axios";
import { refreshAccessToken } from "../../utils/auth";
import exp from "constants";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AuthSlice reducer", () => {
    const initialState: AuthState= {
        user: null,
        refreshToken: null,
        loading: false,
        error: null,
    }

    const sampleUser = {
        username: "worker1",
        role: "WORKER",
        refreshToken: "refresh-token",
    };

    beforeEach(() => {
        localStorage.clear();
    });

    it("Should handle initial state", () => {
        expect(reducer(undefined, {} as AnyAction)).toEqual({
            ...initialState,
            user: JSON.parse(localStorage.getItem("user") || "null"),
            refreshToken: localStorage.getItem("refreshToken"),
        })
    });

    it("Should handle logout", () => {
        const state: AuthState = { ...initialState, user:sampleUser, refreshToken:"abc" };
        const nextState = reducer(state, logout());
        expect(nextState.user).toBe(null);
        expect(nextState.refreshToken).toBeNull();
        expect(localStorage.getItem("user")).toBeNull();
        expect(localStorage.getItem("refreshToken")).toBeNull();
    });

    it("should handle clearError", () => {
        const state: AuthState = { ...initialState, error: "Some error" };
        const nextState = reducer(state, clearError());
        expect(nextState.error).toBeNull();
    });

    it("should handle login.fulfilled", () => {
        const action = { type: login.fulfilled.type, payload: sampleUser };
        const nextState = reducer(initialState, action);
        expect(nextState.user).toEqual({ username: "worker1", role: "WORKER" });
        expect(nextState.refreshToken).toBe("refresh-token");
        expect(JSON.parse(localStorage.getItem("user") || "{}")).toEqual({
        username: "worker1",
        role: "WORKER",
        });
    });

    it("should handle login.rejected", () => {
        const action = { type: login.rejected.type, payload: "Login failed" };
        const nextState = reducer(initialState, action);
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe("Login failed");
    });

    it("should handle register fulfilled", () => {
        const action = { type: register.fulfilled.type, payload: sampleUser };
        const nextState = reducer(initialState, action);
        expect(nextState.user).toEqual({ username: "worker1", role: "WORKER" });
        expect(nextState.loading).toBe(false);
    });

    it("should handle register.rejected", () => {
        const action = { type: register.rejected.type, payload: "Registration failed" };
        const nextState = reducer(initialState, action);
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe("Registration failed");
    });

});