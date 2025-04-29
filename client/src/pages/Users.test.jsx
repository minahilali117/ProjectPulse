import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Users from "../pages/Users";
import { useGetTeamListsQuery, useDeleteUserMutation, useUserActionMutation } from "../redux/slices/api/userApiSlice";
import { BrowserRouter } from "react-router-dom";

// Mock API hooks
jest.mock("../redux/slices/api/userApiSlice", () => ({
    useGetTeamListsQuery: jest.fn(),
    useDeleteUserMutation: jest.fn(),
    useUserActionMutation: jest.fn(),
}));

// Mock child components
jest.mock("../components", () => ({
    AddUser: ({ open }) => open ? <div data-testid="add-user-modal" /> : null,
    Button: ({ label, onClick }) => <button onClick={onClick}>{label}</button>,
    ConfirmatioDialog: ({ open, onClick }) => open ? <button onClick={onClick} data-testid="delete-confirm-btn" /> : null,
    Loading: () => <div>Loading...</div>,
    Title: ({ title }) => <h1>{title}</h1>,
    UserAction: ({ open, onClick }) => open ? <button onClick={onClick} data-testid="status-confirm-btn" /> : null,
}));

jest.mock("../utils/index", () => ({
    getInitials: (name) => name.charAt(0).toUpperCase(),
}));

const mockUsers = [
    {
        _id: "1",
        name: "Alice Smith",
        title: "Manager",
        email: "alice@example.com",
        role: "Admin",
        isActive: true,
    },
];

describe("Users Component", () => {
    const refetchMock = jest.fn();
    const deleteUserMock = jest.fn(() => Promise.resolve({ data: { message: "Deleted" } }));
    const userActionMock = jest.fn(() => Promise.resolve({ data: { message: "Updated" } }));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <Users />
            </BrowserRouter>
        );
    };

    it("displays loading state", () => {
        useGetTeamListsQuery.mockReturnValue({ data: [], isLoading: true, refetch: refetchMock });
        renderComponent();
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("displays user list after loading", () => {
        useGetTeamListsQuery.mockReturnValue({ data: mockUsers, isLoading: false, refetch: refetchMock });
        useDeleteUserMutation.mockReturnValue([deleteUserMock]);
        useUserActionMutation.mockReturnValue([userActionMock]);

        renderComponent();
        expect(screen.getByText("Alice Smith")).toBeInTheDocument();
        expect(screen.getByText("Manager")).toBeInTheDocument();
        expect(screen.getByText("alice@example.com")).toBeInTheDocument();
        expect(screen.getByText("Admin")).toBeInTheDocument();
        expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("opens add user modal", () => {
        useGetTeamListsQuery.mockReturnValue({ data: mockUsers, isLoading: false, refetch: refetchMock });
        useDeleteUserMutation.mockReturnValue([deleteUserMock]);
        useUserActionMutation.mockReturnValue([userActionMock]);

        renderComponent();
        fireEvent.click(screen.getByText("Add New User"));
        expect(screen.getByTestId("add-user-modal")).toBeInTheDocument();
    });

    it("handles delete user flow", async () => {
        useGetTeamListsQuery.mockReturnValue({ data: mockUsers, isLoading: false, refetch: refetchMock });
        useDeleteUserMutation.mockReturnValue([deleteUserMock]);
        useUserActionMutation.mockReturnValue([userActionMock]);

        renderComponent();
        fireEvent.click(screen.getByText("Delete"));
        fireEvent.click(await screen.findByTestId("delete-confirm-btn"));

        await waitFor(() => {
            expect(deleteUserMock).toHaveBeenCalledWith("1");
            expect(refetchMock).toHaveBeenCalled();
        });
    });

    it("handles user status toggle", async () => {
        useGetTeamListsQuery.mockReturnValue({ data: mockUsers, isLoading: false, refetch: refetchMock });
        useDeleteUserMutation.mockReturnValue([deleteUserMock]);
        useUserActionMutation.mockReturnValue([userActionMock]);

        renderComponent();
        fireEvent.click(screen.getByText("Active")); // toggle status
        fireEvent.click(await screen.findByTestId("status-confirm-btn"));

        await waitFor(() => {
            expect(userActionMock).toHaveBeenCalledWith({ isActive: false, id: "1" });
            expect(refetchMock).toHaveBeenCalled();
        });
    });
});
