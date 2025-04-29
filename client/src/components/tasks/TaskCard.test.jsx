import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';
import { Provider } from 'react-redux';
import { store } from '../../redux/store'; // Assuming you have a Redux store set up

describe('TaskCard', () => {
    const mockTask = {
        _id: '1',
        title: 'Test Task',
        priority: 'high',
        stage: 'in-progress',
        date: '2025-04-01',
        subTasks: [{ title: 'Subtask 1', date: '2025-04-02', tag: 'urgent' }],
        team: [{ name: 'User 1' }],
        activities: [],
        assets: [],
    };

    it('renders task information correctly', () => {
        render(
            <Provider store={store}>
                <TaskCard task={mockTask} />
            </Provider>
        );

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('high Priority')).toBeInTheDocument();
        expect(screen.getByText('Subtask 1')).toBeInTheDocument();
        expect(screen.getByText('urgent')).toBeInTheDocument();
    });

    it('opens AddSubTask dialog when ADD SUBTASK is clicked', () => {
        render(
            <Provider store={store}>
                <TaskCard task={mockTask} />
            </Provider>
        );

        fireEvent.click(screen.getByText('ADD SUBTASK'));
        expect(screen.getByText('Add Subtask')).toBeInTheDocument(); // Assuming 'Add Subtask' text in the dialog
    });
});
