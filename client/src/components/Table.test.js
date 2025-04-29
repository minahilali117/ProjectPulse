import { render, screen, fireEvent } from "@testing-library/react";
import Table from "./Table";
import { BrowserRouter } from "react-router-dom";

// Mock mutation hook
const mockDelete = jest.fn().mockResolvedValue({ message: "Deleted!" });
jest.mock("../redux/slices/api/taskApiSlice", () => ({
    useTrashTastMutation: () => [mockDelete],
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const task = {
    _id: "1",
    title: "Fix bug",
    priority: "medium",
    date: new Date().toISOString(),
    stage: "todo",
    team: [{ _id: "u1", name: "Alice" }],
    subTasks: [],
    assets: [],
    activities: [],
};

describe("Table", () => {
    it("renders tasks correctly", () => {
        render(
            <BrowserRouter>
                <Table tasks={[task]} />
            </BrowserRouter>
        );

        expect(screen.getByText("Fix bug")).toBeInTheDocument();
        expect(screen.getByText(/medium Priority/i)).toBeInTheDocument();
        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("opens delete dialog and calls mutation", async () => {
        render(
            <BrowserRouter>
                <Table tasks={[task]} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText("Delete"));
        expect(screen.getByTestId("dialog")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Confirm"));
        expect(mockDelete).toHaveBeenCalledWith({
            id: "1",
            isTrashed: "trash",
        });
    });

    it("opens edit modal", () => {
        render(
            <BrowserRouter>
                <Table tasks={[task]} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText("Edit"));
        expect(screen.getByTestId("add-task-modal")).toBeInTheDocument();
    });
});
