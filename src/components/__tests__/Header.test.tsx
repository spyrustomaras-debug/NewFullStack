import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import Header from "../../components/Header";
import authReducer, * as authSlice from "../../features/auth/authSlice";
import projectReducer, * as projectSlice from "../../features/projects/projectSlice";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Header component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(authSlice, "logout");
    jest.spyOn(projectSlice, "resetProjects");
  });

  const renderWithStore = () => {
    const store = configureStore({
        reducer: {
            auth: authReducer,
            projects: projectReducer,
        },
        preloadedState: {
            auth: { user: { username: "worker1", role: "WORKER" }, refreshToken: null, loading: false, error: null },
            projects: { projects: [], loading: false, error: null },
        },
    });


    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
  };

  it("renders the username", () => {
    renderWithStore();
    expect(screen.getByText(/worker1/i)).toBeInTheDocument();
  });
});
