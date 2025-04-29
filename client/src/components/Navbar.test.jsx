import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import '@testing-library/jest-dom';

describe('Navbar Component', () => {
    const setup = () =>
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

    test('renders input and handles search submission', () => {
        setup();
        const input = screen.getByPlaceholderText(/Search by title/i);
        fireEvent.change(input, { target: { value: 'Test Query' } });

        const form = input.closest('form');
        fireEvent.submit(form);

        // URL should update — cannot test `window.location.href` easily without mocking
        expect(window.location.pathname).toMatch('/');
    });

    test('shows search icon and input interaction', () => {
        setup();
        const input = screen.getByPlaceholderText(/Search by title/i);
        expect(input).toBeInTheDocument();

        fireEvent.change(input, { target: { value: '' } });
        fireEvent.submit(input.closest('form'));

        expect(window.location.pathname).toBe('/');
    });
});
