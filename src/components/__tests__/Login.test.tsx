// src/components/__tests__/Login.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";
import { login } from "../../features/auth/authSlice";

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Mock login action
jest.mock("../../features/auth/authSlice", () => ({
  login: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const renderWithProviders = (store: any) =>
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

describe("Login Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: { loading: false, error: null },
    });
    jest.clearAllMocks();
  });

  it("renders login form fields", () => {
    renderWithProviders(store);
    expect(screen.getByPlaceholderText(/enter your username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates input values when typing", async () => {
    renderWithProviders(store);

    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(passwordInput, "password123");

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
  });

  it("dispatches login action on submit", async () => {
    store.dispatch = jest.fn().mockResolvedValue({
        type: "auth/login/fulfilled", // hardcode the string
        payload: { role: "WORKER" },
    });

  renderWithProviders(store);

  const usernameInput = screen.getByPlaceholderText(/enter your username/i);
  const passwordInput = screen.getByPlaceholderText(/enter your password/i);
  const button = screen.getByRole("button", { name: /login/i });

  await userEvent.type(usernameInput, "worker1");
  await userEvent.type(passwordInput, "secret123");

  fireEvent.click(button);

  await waitFor(() => {
    expect(store.dispatch).toHaveBeenCalledWith(
      login({ username: "worker1", password: "secret123" })
    );
    expect(mockedNavigate).toHaveBeenCalledWith("/worker-dashboard");
  });
  });

  it("shows error message when login fails", () => {
    store = mockStore({
      auth: { loading: false, error: "Invalid credentials" },
    });
    renderWithProviders(store);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("shows loading state on button", () => {
    store = mockStore({auth: { loading: true, error: null }});
    renderWithProviders(store);
    expect(screen.getByRole("button")).toHaveTextContent(/logging in/i);
    expect(screen.getByRole("button")).toBeDisabled();
  });

});




