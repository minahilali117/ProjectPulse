import createJWT from '../utils/index';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

process.env.JWT_SECRET = 'testsecret'; // ✅ Inject env var for test

describe('createJWT', () => {
    const mockRes = {
        cookie: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should generate JWT and set cookie', () => {
        jwt.sign.mockReturnValue('mockToken');

        createJWT(mockRes, '12345');

        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: '12345' },
            'testsecret',
            { expiresIn: '1d' }
        );

        expect(mockRes.cookie).toHaveBeenCalledWith('token', 'mockToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 86400000,
        });
    });
});

