import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter to wrap the component
import { useSelector } from 'react-redux';  // Import redux hooks
import Tasks from './Tasks';  // Import the Tasks component
import { useGetAllTaskQuery } from '../redux/slices/api/taskApiSlice';  // Import the API hook

// Mock the necessary hooks
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('../redux/slices/api/taskApiSlice', () => ({
    useGetAllTaskQuery: jest.fn(),
}));

// Mock the TASK_TYPE if it's missing in the utils folder
const TASK_TYPE = {
    todo: 'To Do',
    'in progress': 'In Progress',
    completed: 'Completed',
};

describe('Tasks Component', () => {
    beforeEach(() => {
        // Reset all mocks before each test to avoid state leaking between tests
        jest.resetAllMocks();
    });

    test('renders tasks for admin user and shows the "Create Project" button', async () => {
        // Mock useSelector to return an admin user
        useSelector.mockImplementation((selectorFn) =>
            selectorFn({
                auth: { user: { isAdmin: true } },  // Mocking the admin user state
            })
        );

        // Mock API hook to simulate data
        useGetAllTaskQuery.mockReturnValue({
            data: { tasks: [] },  // Return an empty tasks list for now
            isLoading: false,
            refetch: jest.fn(),
        });

        // Wrap the component inside BrowserRouter for router hooks to work
        render(
            <BrowserRouter>
                <Tasks />
            </BrowserRouter>
        );

        // Check if the "Create Project" button is rendered for an admin user
        expect(screen.getByText('Create Project')).toBeInTheDocument();
    });

    test('does not show "Create Project" button for non-admin user', async () => {
        // Mock useSelector to return a non-admin user
        useSelector.mockImplementation((selectorFn) =>
            selectorFn({
                auth: { user: { isAdmin: false } },  // Mocking a non-admin user state
            })
        );

        // Mock API hook to simulate data
        useGetAllTaskQuery.mockReturnValue({
            data: { tasks: [] },
            isLoading: false,
            refetch: jest.fn(),
        });

        // Wrap the component inside BrowserRouter for router hooks to work
        render(
            <BrowserRouter>
                <Tasks />
            </BrowserRouter>
        );

        // Check that the "Create Project" button is NOT rendered for a non-admin user
        expect(screen.queryByText('Create Project')).toBeNull();
    });

    test('displays tasks correctly in list view', async () => {
        // Mock useSelector to return an admin user
        useSelector.mockImplementation((selectorFn) =>
            selectorFn({
                auth: { user: { isAdmin: true } },
            })
        );

        // Mock API hook to simulate task data
        useGetAllTaskQuery.mockReturnValue({
            data: {
                tasks: [
                    { id: 1, title: 'Task 1', status: TASK_TYPE.todo },
                    { id: 2, title: 'Task 2', status: TASK_TYPE['in progress'] },
                ],
            },
            isLoading: false,
            refetch: jest.fn(),
        });

        // Wrap the component inside BrowserRouter for router hooks to work
        render(
            <BrowserRouter>
                <Tasks />
            </BrowserRouter>
        );

        // Switch to List View
        fireEvent.click(screen.getByText('List View'));

        // Check if tasks are displayed in the list view
        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Task 2')).toBeInTheDocument();
        });
    });

    test('displays loading state while fetching tasks', async () => {
        // Mock useSelector to return an admin user
        useSelector.mockImplementation((selectorFn) =>
            selectorFn({
                auth: { user: { isAdmin: true } },
            })
        );

        // Mock API hook to simulate loading state
        useGetAllTaskQuery.mockReturnValue({
            data: null,  // No data yet
            isLoading: true,  // Simulate loading
            refetch: jest.fn(),
        });

        // Wrap the component inside BrowserRouter for router hooks to work
        render(
            <BrowserRouter>
                <Tasks />
            </BrowserRouter>
        );

        // Check if the loading indicator is displayed
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('correctly handles search term in URL', async () => {
        // Mock useSelector to return an admin user
        useSelector.mockImplementation((selectorFn) =>
            selectorFn({
                auth: { user: { isAdmin: true } },
            })
        );

        // Mock useSearchParams hook to simulate a search query parameter
        const searchParams = new URLSearchParams();
        searchParams.set('search', 'Task 1');
        useSearchParams.mockReturnValue([searchParams]);

        // Mock API hook to simulate task data
        useGetAllTaskQuery.mockReturnValue({
            data: {
                tasks: [
                    { id: 1, title: 'Task 1', status: TASK_TYPE.todo },
                    { id: 2, title: 'Task 2', status: TASK_TYPE['in progress'] },
                ],
            },
            isLoading: false,
            refetch: jest.fn(),
        });

        // Wrap the component inside BrowserRouter for router hooks to work
        render(
            <BrowserRouter>
                <Tasks />
            </BrowserRouter>
        );

        // Check if the search term is being used and task 1 is displayed
        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.queryByText('Task 2')).toBeNull();  // Task 2 should not be displayed
        });
    });
});
