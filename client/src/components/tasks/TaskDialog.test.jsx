import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TaskDialog from '../tasks/TaskDialog';
import '@testing-library/jest-dom';

const mockClose = jest.fn();
const mockSubmit = jest.fn();

describe('TaskDialog Component', () => {
    const defaultProps = {
        open: true,
        onClose: mockClose,
        onSubmit: mockSubmit,
        mode: 'edit',
        task: { title: 'Test Task', description: 'Test Desc' },
    };

    test('renders with pre-filled data in edit mode', () => {
        render(<TaskDialog {...defaultProps} />);
        expect(screen.getByDisplayValue(/Test Task/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/Test Desc/i)).toBeInTheDocument();
    });

    test('handles input changes', () => {
        render(<TaskDialog {...defaultProps} />);
        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Updated Task' } });
        expect(screen.getByDisplayValue(/Updated Task/i)).toBeInTheDocument();
    });

    test('calls onSubmit with valid input', () => {
        render(<TaskDialog {...defaultProps} />);
        fireEvent.click(screen.getByText(/Save/i));
        expect(mockSubmit).toHaveBeenCalled();
    });

    test('does not call onSubmit with missing title', () => {
        render(<TaskDialog {...defaultProps} task={{ title: '', description: '' }} />);
        fireEvent.click(screen.getByText(/Save/i));
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    test('handles close button', () => {
        render(<TaskDialog {...defaultProps} />);
        fireEvent.click(screen.getByLabelText(/close/i));
        expect(mockClose).toHaveBeenCalled();
    });
});
