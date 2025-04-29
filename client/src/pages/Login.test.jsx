import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Login"; // <-- adjust if your Login path is different
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { toast } from "sonner";

// Mock components
jest.mock("../components", () => ({
    Button: ({ label, ...props }) => <button {...props}>{label}</button>,
    Loading: () => <div data-testid="loading-component">Loading...</div>,
    Textbox: ({ label, register, error, ...props }) => (
        <div>
            <label htmlFor={label}>{label}</label>
            <input id={label} {...props} {...register} />
            {error && <span>{error}</span>}
        </div>
    ),
}));

// Mock hooks
jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

jest.mock("../redux/slices/api/authApiSlice", () => ({
    useLoginMutation: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
    },
}));

describe("Login Page", () => {
    let mockDispatch;
    let mockNavigate;
    let mockLogin;

    beforeEach(() => {
        mockDispatch = jest.fn();
        mockNavigate = jest.fn();
        mockLogin = jest.fn();

        useDispatch.mockReturnValue(mockDispatch);
        useNavigate.mockReturnValue(mockNavigate);
        useSelector.mockReturnValue({ user: null });
        useLoginMutation.mockReturnValue([mockLogin, { isLoading: false }]);

        jest.clearAllMocks();
    });

    test("renders login form correctly", () => {
        render(<Login />);

        expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByText(/Log in/i)).toBeInTheDocument();
    });

    test("shows validation errors when submitting empty form", async () => {
        render(<Login />);

        fireEvent.click(screen.getByText(/Log in/i));

        await waitFor(() => {
            expect(screen.getByText(/Email Address is required!/i)).toBeInTheDocument();
            expect(screen.getByText(/Password is required!/i)).toBeInTheDocument();
        });
    });

    test("successful login redirects to '/'", async () => {
        mockLogin.mockReturnValue({
            unwrap: () => Promise.resolve({ token: "fake-token", user: { name: "Test User" } }),
        });

        render(<Login />);

        fireEvent.change(screen.getByLabelText(/Email Address/i), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByText(/Log in/i));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
            expect(mockDispatch).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    test("shows toast error on failed login", async () => {
        mockLogin.mockReturnValue({
            unwrap: () => Promise.reject({ data: { message: "Invalid credentials" } }),
        });

        render(<Login />);

        fireEvent.change(screen.getByLabelText(/Email Address/i), {
            target: { value: "wrong@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: "wrongpassword" },
        });

        fireEvent.click(screen.getByText(/Log in/i));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
        });
    });

    test("redirects to dashboard if already logged in", async () => {
        useSelector.mockReturnValue({ user: { name: "Already Logged In" } });

        render(<Login />);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
    });
});
