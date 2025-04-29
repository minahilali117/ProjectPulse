import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddUser from './AddUser';
import '@testing-library/jest-dom';

jest.mock('../utils/index.js', () => ({
    getUserRole: () => 'admin',
}));

describe('AddUser Component', () => {
    test('renders all input fields', () => {
        render(<AddUser />);
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
    });

    test('handles user input and submission', async () => {
        render(<AddUser />);
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'member' } });
        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(screen.queryByText(/User added successfully/i)).toBeInTheDocument();
        });
    });

    test('shows validation errors for empty input', async () => {
        render(<AddUser />);
        fireEvent.click(screen.getByText(/Submit/i));

        expect(await screen.findAllByText(/required/i)).toHaveLength(2);
    });

    test('handles server failure gracefully', async () => {
        // Simulate error state (inject mock failure if API exists)
        // Add test for try-catch or error boundary if used
    });
});
