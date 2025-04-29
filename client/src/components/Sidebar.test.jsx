import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import '@testing-library/jest-dom';

describe('Sidebar Component', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );
    });

    test('renders sidebar title and icon', () => {
        expect(screen.getByText(/TaskSync/i)).toBeInTheDocument();
        const svgIcons = screen.getAllByRole('img', { hidden: true });
        expect(svgIcons.length).toBeGreaterThanOrEqual(3); // At least Dashboard, Create Task, Settings
    });

    test('renders all navigation links with correct labels', () => {
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Create Task/i)).toBeInTheDocument();
        expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    });

    test('links have correct hrefs', () => {
        const dashboardLink = screen.getByText(/Dashboard/i).closest('a');
        const createTaskLink = screen.getByText(/Create Task/i).closest('a');
        const settingsLink = screen.getByText(/Settings/i).closest('a');

        expect(dashboardLink).toHaveAttribute('href', '/');
        expect(createTaskLink).toHaveAttribute('href', '/create-task');
        expect(settingsLink).toHaveAttribute('href', '/settings');
    });

    test('renders icon components (LayoutDashboard, PlusCircle, Settings)', () => {
        const dashboardIcon = screen.getByText(/Dashboard/i).previousSibling;
        const createIcon = screen.getByText(/Create Task/i).previousSibling;
        const settingsIcon = screen.getByText(/Settings/i).previousSibling;

        expect(dashboardIcon?.nodeName).toMatch(/svg/i);
        expect(createIcon?.nodeName).toMatch(/svg/i);
        expect(settingsIcon?.nodeName).toMatch(/svg/i);
    });
});
