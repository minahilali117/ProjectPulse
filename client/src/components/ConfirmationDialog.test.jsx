import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmatioDialog, { UserAction } from "../components/ConfirmationDialog";

describe("ConfirmatioDialog", () => {
    const mockSetOpen = jest.fn();
    const mockOnClick = jest.fn();

    it("renders delete message and calls onClick", () => {
        render(
            <ConfirmatioDialog open={true} setOpen={mockSetOpen} onClick={mockOnClick} />
        );

        expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Delete/i));
        expect(mockOnClick).toHaveBeenCalled();
    });

    it("closes modal on cancel", () => {
        render(
            <ConfirmatioDialog open={true} setOpen={mockSetOpen} onClick={mockOnClick} />
        );

        fireEvent.click(screen.getByText(/Cancel/i));
        expect(mockSetOpen).toHaveBeenCalledWith(false);
    });

    it("renders restore button when type is restore", () => {
        render(
            <ConfirmatioDialog open={true} setOpen={mockSetOpen} type="restore" />
        );

        expect(screen.getByText(/Restore/i)).toBeInTheDocument();
    });
});

describe("UserAction Dialog", () => {
    const mockSetOpen = jest.fn();
    const mockOnClick = jest.fn();

    it("renders confirmation dialog and calls onClick", () => {
        render(<UserAction open={true} setOpen={mockSetOpen} onClick={mockOnClick} />);

        expect(screen.getByText(/Are you sure you want to activate or deactive/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Yes/i));
        expect(mockOnClick).toHaveBeenCalled();
    });

    it("closes the dialog on No", () => {
        render(<UserAction open={true} setOpen={mockSetOpen} onClick={mockOnClick} />);

        fireEvent.click(screen.getByText(/No/i));
        expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
});
