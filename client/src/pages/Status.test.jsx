import { render, screen } from "@testing-library/react";
import Status from "../pages/Status"; // adjust path if needed
import { useGetUserTaskStatusQuery } from "../redux/slices/api/userApiSlice";
import { countTasksByStage, getInitials } from "../utils";

// Mock components
jest.mock("../components", () => ({
    Loading: () => <div data-testid="loading-component">Loading...</div>,
    Title: ({ title }) => <h1>{title}</h1>,
}));

// Mock hooks
jest.mock("../redux/slices/api/userApiSlice", () => ({
    useGetUserTaskStatusQuery: jest.fn(),
}));

// Mock utils
jest.mock("../utils", () => ({
    countTasksByStage: jest.fn(),
    getInitials: jest.fn(),
}));

describe("StatusPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("shows loading when data is loading", () => {
        useGetUserTaskStatusQuery.mockReturnValue({ isLoading: true });

        render(<Status />);

        expect(screen.getByTestId("loading-component")).toBeInTheDocument();
    });

    test("renders user task status correctly", () => {
        const mockUsers = [
            {
                name: "John Doe",
                title: "Developer",
                tasks: [{}, {}, {}], // 3 tasks
            },
        ];

        useGetUserTaskStatusQuery.mockReturnValue({ data: mockUsers, isLoading: false });

        getInitials.mockReturnValue("JD");
        countTasksByStage.mockReturnValue({
            inProgress: 0.3,
            todo: 0.5,
            completed: 0.2,
        });

        render(<Status />);

        expect(screen.getByText(/User Task Status/i)).toBeInTheDocument();
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/Developer/i)).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument(); // total tasks
    });

    test("renders no users gracefully", () => {
        useGetUserTaskStatusQuery.mockReturnValue({ data: [], isLoading: false });

        render(<Status />);

        expect(screen.getByText(/User Task Status/i)).toBeInTheDocument();
        expect(screen.queryByText(/No Users Found/i)).not.toBeInTheDocument();
        // Optionally, you can show a "no users" message if you want
    });
});
