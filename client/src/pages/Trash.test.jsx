// Trash.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Trash from "../pages/Trash";
import { useGetAllTaskQuery, useDeleteRestoreTastMutation } from "../redux/slices/api/taskApiSlice";
import { BrowserRouter } from "react-router-dom";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useSearchParams: () => [new URLSearchParams("search=")],
}));

// Mock API slice
jest.mock("../redux/slices/api/taskApiSlice", () => ({
    useGetAllTaskQuery: jest.fn(),
    useDeleteRestoreTastMutation: jest.fn(),
}));

// Wrapper with router context
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("Trash Component", () => {
    const mockRefetch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("displays loading state", () => {
        useGetAllTaskQuery.mockReturnValue({ data: null, isLoading: true });
        useDeleteRestoreTastMutation.mockReturnValue([jest.fn()]);

        renderWithRouter(<Trash />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test("shows message when there are no trashed tasks", () => {
        useGetAllTaskQuery.mockReturnValue({ data: { tasks: [] }, isLoading: false });
        useDeleteRestoreTastMutation.mockReturnValue([jest.fn()]);

        renderWithRouter(<Trash />);
        expect(screen.getByText(/no trashed task/i)).toBeInTheDocument();
    });

    test("renders tasks and buttons correctly", () => {
        useGetAllTaskQuery.mockReturnValue({
            data: {
                tasks: [
                    {
                        _id: "1",
                        title: "Test Task",
                        priority: "high",
                        stage: "todo",
                        date: new Date().toISOString(),
                    },
                ],
            },
            isLoading: false,
            refetch: mockRefetch,
        });

        useDeleteRestoreTastMutation.mockReturnValue([jest.fn().mockResolvedValue({ message: "Success" })]);

        renderWithRouter(<Trash />);
        expect(screen.getByText(/test task/i)).toBeInTheDocument();
        expect(screen.getByText(/delete all/i)).toBeInTheDocument();
        expect(screen.getByText(/restore all/i)).toBeInTheDocument();
    });

    test("clicking delete button opens confirmation dialog", async () => {
        const mockDeleteRestore = jest.fn().mockResolvedValue({ message: "Deleted" });
        useDeleteRestoreTastMutation.mockReturnValue([mockDeleteRestore]);

        useGetAllTaskQuery.mockReturnValue({
            data: {
                tasks: [
                    {
                        _id: "1",
                        title: "Task to Delete",
                        priority: "low",
                        stage: "done",
                        date: new Date().toISOString(),
                    },
                ],
            },
            isLoading: false,
            refetch: mockRefetch,
        });

        renderWithRouter(<Trash />);
        fireEvent.click(screen.getAllByRole("button", { name: "" })[1]); // delete icon

        await waitFor(() => {
            expect(screen.getByText(/do you want to permenantly delete/i)).toBeInTheDocument();
        });
    });

    test("clicking restore button opens confirmation dialog", async () => {
        const mockDeleteRestore = jest.fn().mockResolvedValue({ message: "Restored" });
        useDeleteRestoreTastMutation.mockReturnValue([mockDeleteRestore]);

        useGetAllTaskQuery.mockReturnValue({
            data: {
                tasks: [
                    {
                        _id: "1",
                        title: "Task to Restore",
                        priority: "medium",
                        stage: "inprogress",
                        date: new Date().toISOString(),
                    },
                ],
            },
            isLoading: false,
            refetch: mockRefetch,
        });

        renderWithRouter(<Trash />);
        fireEvent.click(screen.getAllByRole("button", { name: "" })[0]); // restore icon

        await waitFor(() => {
            expect(screen.getByText(/do you want to restore the selected item/i)).toBeInTheDocument();
        });
    });
});
