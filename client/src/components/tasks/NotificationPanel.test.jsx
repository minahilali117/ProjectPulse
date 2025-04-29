import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationPanel from './NotificationPanel';
import { useGetNotificationsQuery, useMarkNotiAsReadMutation } from '../redux/slices/api/userApiSlice';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; // Assuming you have a Redux store set up

jest.mock('../redux/slices/api/userApiSlice');

describe('NotificationPanel', () => {
    it('renders notifications and displays notification count', async () => {
        useGetNotificationsQuery.mockReturnValue({
            data: [
                { _id: '1', notiType: 'alert', text: 'Test notification 1', createdAt: '2021-01-01' },
                { _id: '2', notiType: 'message', text: 'Test notification 2', createdAt: '2021-01-01' },
            ],
            refetch: jest.fn(),
        });

        render(
            <Provider store={store}>
                <NotificationPanel />
            </Provider>
        );

        expect(screen.getByText('Test notification 1')).toBeInTheDocument();
        expect(screen.getByText('Test notification 2')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); // Notification count
    });

    it('opens notification view when clicked', async () => {
        const mockMarkAsRead = jest.fn();
        useMarkNotiAsReadMutation.mockReturnValue([mockMarkAsRead]);

        useGetNotificationsQuery.mockReturnValue({
            data: [
                { _id: '1', notiType: 'alert', text: 'Test notification 1', createdAt: '2021-01-01' },
            ],
            refetch: jest.fn(),
        });

        render(
            <Provider store={store}>
                <NotificationPanel />
            </Provider>
        );

        fireEvent.click(screen.getByText('Test notification 1'));
        expect(mockMarkAsRead).toHaveBeenCalledTimes(1);
    });

    it('marks all notifications as read when clicked', async () => {
        const mockMarkAsRead = jest.fn();
        useMarkNotiAsReadMutation.mockReturnValue([mockMarkAsRead]);

        useGetNotificationsQuery.mockReturnValue({
            data: [
                { _id: '1', notiType: 'alert', text: 'Test notification 1', createdAt: '2021-01-01' },
            ],
            refetch: jest.fn(),
        });

        render(
            <Provider store={store}>
                <NotificationPanel />
            </Provider>
        );

        fireEvent.click(screen.getByText('Mark All Read'));
        await waitFor(() => expect(mockMarkAsRead).toHaveBeenCalledTimes(1));
    });
});
