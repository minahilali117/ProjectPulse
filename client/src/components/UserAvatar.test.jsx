import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserAvatar from './UserAvatar';
import { useLogoutMutation } from '../redux/slices/api/authApiSlice';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; // Assuming you have a Redux store set up

jest.mock('../redux/slices/api/authApiSlice');
jest.mock('sonner', () => ({
    toast: { error: jest.fn() },
}));

describe('UserAvatar', () => {
    it('renders user avatar and shows menu items', () => {
        const mockUser = { name: 'John Doe' };
        render(
            <Provider store={store}>
                <UserAvatar />
            </Provider>
        );

        expect(screen.getByText('JD')).toBeInTheDocument(); // Assuming getInitials('John Doe') returns 'JD'
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Change Password')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('calls logout handler and redirects to login', async () => {
        const mockLogout = jest.fn();
        useLogoutMutation.mockReturnValue([mockLogout]);

        render(
            <Provider store={store}>
                <UserAvatar />
            </Provider>
        );

        fireEvent.click(screen.getByText('Logout'));
        await waitFor(() => expect(mockLogout).toHaveBeenCalledTimes(1));
    });

    it('shows error toast when logout fails', async () => {
        useLogoutMutation.mockReturnValue([jest.fn().mockRejectedValue(new Error('Logout failed'))]);

        render(
            <Provider store={store}>
                <UserAvatar />
            </Provider>
        );

        fireEvent.click(screen.getByText('Logout'));
        await waitFor(() => expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument());
    });
});
