import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ChangePassword from '../components/ChangePassword';
import '@testing-library/jest-dom';

describe('ChangePassword Component', () => {
    test('renders fields', () => {
        render(<ChangePassword />);
        expect(screen.getByLabelText(/Old Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });

    test('shows mismatch error', () => {
        render(<ChangePassword />);
        fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: '123456' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: '654321' } });
        fireEvent.click(screen.getByText(/Change Password/i));
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    test('displays error on missing fields', () => {
        render(<ChangePassword />);
        fireEvent.click(screen.getByText(/Change Password/i));
        expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });

    test('submits successfully on valid input', async () => {
        render(<ChangePassword />);
        fireEvent.change(screen.getByLabelText(/Old Password/i), { target: { value: 'oldPass123' } });
        fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newPass123' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'newPass123' } });
        fireEvent.click(screen.getByText(/Change Password/i));
        // Mock success call, test for success message if rendered
    });
});
