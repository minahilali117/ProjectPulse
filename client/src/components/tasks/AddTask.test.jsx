import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddTask from "./AddTask";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../../redux/slices/api/taskApiSlice";
import { Dialog } from "@headlessui/react";
import { toast } from "sonner";

jest.mock("../../redux/slices/api/taskApiSlice", () => ({
    useCreateTaskMutation: jest.fn(),
    useUpdateTaskMutation: jest.fn(),
}));

jest.mock("../utils/firebase", () => ({
    app: {},
}));



jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe("AddTask Component", () => {
    const setOpen = jest.fn();

    beforeEach(() => {
        useCreateTaskMutation.mockReturnValue([jest.fn(() => Promise.resolve({ unwrap: () => ({ message: "Task created" }) })), { isLoading: false }]);
        useUpdateTaskMutation.mockReturnValue([jest.fn(() => Promise.resolve({ unwrap: () => ({ message: "Task updated" }) })), { isLoading: false }]);
    });

    it("renders form fields correctly", () => {
        render(<AddTask open={true} setOpen={setOpen} />);
        expect(screen.getByLabelText(/Project Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Project Date/i)).toBeInTheDocument();
        expect(screen.getByText(/Add Assets/i)).toBeInTheDocument();
        expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    });

    it("submits the form with minimal required fields", async () => {
        render(<AddTask open={true} setOpen={setOpen} />);

        fireEvent.change(screen.getByLabelText(/Project Title/i), {
            target: { value: "New Task" },
        });

        fireEvent.change(screen.getByLabelText(/Project Date/i), {
            target: { value: "2025-05-01" },
        });

        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Task created");
            expect(setOpen).toHaveBeenCalled();
        });
    });
});
