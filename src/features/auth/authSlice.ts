import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  refreshToken: localStorage.getItem("refreshToken"),
  loading: false,
  error: null,
};

// Register
export const register = createAsyncThunk(
  "auth/register",
  async (data: { username: string; email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/register/", data);
      return res.data; // { id, username, email, role }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Registration failed");
    }
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", credentials);
      // Save access token only in localStorage
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);
      return {
        username: res.data.username,
        role: res.data.role,
        refreshToken: res.data.refresh,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.refreshToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user"); // ✅ clear persisted user
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.user = { username: action.payload.username, role: action.payload.role };
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("user", JSON.stringify(state.user));

    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.user = { username: action.payload.username, role: action.payload.role };
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
