import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { BrowserRouter } from "react-router-dom";
import { register } from "../../features/auth/authSlice";
import Register from "../Register";

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Mock register action
jest.mock("../../features/auth/authSlice", () => ({
  register: jest.fn(),
}));


const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const renderWithProviders = (store: any) =>
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    </Provider>
  );

describe("Register Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: { loading: false, error: null },
    });
    jest.clearAllMocks();
  });

  it("renders register form fields", () => {
    renderWithProviders(store);
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  });

  it("Show validation errors when submitting empty form", async () => {
    renderWithProviders(store);

    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it("Shows email format error", async() => {
    renderWithProviders(store);

    await userEvent.type(screen.getByPlaceholderText(/enter your username/i), "testuser");
    await userEvent.type(screen.getByPlaceholderText(/enter your email/i), "invalid-email");
    await userEvent.type(screen.getByPlaceholderText(/enter your password/i), "secret1234");
    fireEvent.click(screen.getByRole("button", {name:/register/i}));
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });

  it("shows password length error", async() => {
    renderWithProviders(store);
    await userEvent.type(screen.getByPlaceholderText(/enter your username/i), "testuser");
    await userEvent.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText(/enter your password/i), "123");
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it("clear error when typing after validation error", async() => {
    renderWithProviders(store);
    fireEvent.click(screen.getByRole("button", {name:/register/i}));
    const usernameerror = await screen.findByText(/username is required/i);
    expect(usernameerror).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText(/enter your username/i), "newuser");
    expect(screen.queryByText(/username is required/i)).not.toBeInTheDocument();
  });

  it("dispatches register action and navigates on success", async() => {
    store.dispatch = jest.fn().mockResolvedValue({
        type: "auth/register/fulfilled", // hardcode the string
        payload: { role: "WORKER" },
    });
    renderWithProviders(store);

    await userEvent.type(screen.getByPlaceholderText(/enter your username/i), "worker1");
    await userEvent.type(screen.getByPlaceholderText(/enter your email/i), "worker1@test.com");
    await userEvent.type(screen.getByPlaceholderText(/enter your password/i), "secret123");

    fireEvent.click(screen.getByRole("button", {name:/register/i}));

    await waitFor(()=> {
        expect(store.dispatch).toHaveBeenCalledWith(register({username:"worker1", email:"worker1@test.com", password:"secret123", role:"worker"}))        
    });
    expect(mockedNavigate).toHaveBeenCalledWith("/login")
  });

});
