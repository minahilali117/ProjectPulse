import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskDetail from './TaskDetail';
import { useGetSingleTaskQuery, useChangeSubTaskStatusMutation, usePostTaskActivityMutation } from '../redux/slices/api/taskApiSlice';

// Mocks for the Redux API hooks
jest.mock('../redux/slices/api/taskApiSlice', () => ({
    useGetSingleTaskQuery: jest.fn(),
    useChangeSubTaskStatusMutation: jest.fn(),
    usePostTaskActivityMutation: jest.fn(),
}));
const mockPostActivity = jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve({ success: true })),
}));

describe('TaskDetail', () => {
    const mockTaskData = {
        task: {
            _id: 'task1',
            title: 'Test Task',
            priority: 'high',
            stage: 'in progress',
            subTasks: [
                { _id: 'sub1', title: 'Subtask 1', isCompleted: false, date: '2025-04-28T10:00:00Z' },
                { _id: 'sub2', title: 'Subtask 2', isCompleted: true, date: '2025-04-27T10:00:00Z' },
            ],
            team: [
                { _id: 'user1', name: 'John Doe', title: 'Developer' },
                { _id: 'user2', name: 'Jane Smith', title: 'Designer' },
            ],
            description: 'Task description',
            assets: [],
            activities: [
                { id: 'act1', type: 'started', by: { name: 'John Doe' }, activity: 'Task started', date: '2025-04-28T10:00:00Z' },
            ],
        },
    };

    beforeEach(() => {
        // Mock the API hook responses
        useGetSingleTaskQuery.mockReturnValue({ data: mockTaskData, isLoading: false, refetch: jest.fn() });
        useChangeSubTaskStatusMutation.mockReturnValue([jest.fn(), { isLoading: false }]);
        usePostTaskActivityMutation.mockReturnValue([jest.fn(), { isLoading: false }]);
    });

    test('renders task title and details', async () => {
        render(<TaskDetail />);

        // Check if task title is rendered
        expect(screen.getByText('Test Task')).toBeInTheDocument();
        // Check if task priority is displayed with correct class
        expect(screen.getByText('high Priority')).toBeInTheDocument();
        // Check if task stage is displayed

        expect(screen.getAllByText('in progress').length).toBeGreaterThan(0);

    });

    test('renders subtasks and marks them as done/undone', async () => {
        render(<TaskDetail />);

        // Check if subtasks are rendered
        expect(screen.getByText('Subtask 1')).toBeInTheDocument();
        expect(screen.getByText('Subtask 2')).toBeInTheDocument();

        // Click the "Mark as Done" button for Subtask 1
        fireEvent.click(screen.getByText('Mark as Done'));

        // Check if the button text changes to "Mark as Undone" after clicking
        await waitFor(() => expect(screen.getByText('Mark as Undone')).toBeInTheDocument());
    });
    describe('TaskDetail - Activity Submission', () => {
        it('handles activity form submission', async () => {
            useParams.mockReturnValue({ id: '123' });

            const refetchMock = jest.fn();
            const postActivityMock = jest.fn(() => Promise.resolve({ message: 'Activity added' }));
            usePostTaskActivityMutation.mockReturnValue([postActivityMock, { isLoading: false }]);

            useGetSingleTaskQuery.mockReturnValue({
                data: {
                    task: {
                        title: 'Test Task',
                        priority: 'medium',
                        stage: 'in progress',
                        date: new Date().toISOString(),
                        assets: [],
                        subTasks: [],
                        team: [],
                        activities: [],
                    },
                },
                isLoading: false,
                refetch: refetchMock,
            });

            render(<TaskDetail />);

            // Navigate to "Activities/Timeline" tab
            fireEvent.click(screen.getByText(/Activities\/Timeline/i));

            // Type in the activity
            fireEvent.change(screen.getByPlaceholderText('Type ......'), {
                target: { value: 'New activity from test' },
            });

            // Click submit
            fireEvent.click(screen.getByText(/Submit/i));

            await waitFor(() => {
                expect(postActivityMock).toHaveBeenCalledWith({
                    data: {
                        type: 'started',
                        activity: 'New activity from test',
                    },
                    id: '123',
                });
            });
        });
    });

    test('displays loading state', () => {
        // Mock isLoading state from API
        useGetSingleTaskQuery.mockReturnValue({
            data: null,
            isLoading: true,
            refetch: jest.fn(),
        });

        const { container } = render(<TaskDetail />);

        const loadingElement = container.querySelector('.dots-container');
        expect(loadingElement).toBeInTheDocument();

        const dots = container.querySelectorAll('.dot');
        expect(dots.length).toBe(5);
    });
});
