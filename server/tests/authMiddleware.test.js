// tests/authMiddleware.test.js
import jwt from 'jsonwebtoken';
import { protectRoute, isAdminRoute } from '../middleware/authMiddleware.js';

describe('Auth Middleware', () => {
    process.env.JWT_SECRET = 'testsecret';
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    it('rejects missing token', async () => {
        const req = { cookies: {} };
        await protectRoute(req, mockRes, next);
        expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('allows valid token', async () => {
        const token = jwt.sign({ userId: '123', isAdmin: true }, process.env.JWT_SECRET);
        const req = { cookies: { token } };
        // mock User.findById
        jest.spyOn(require('../models/userModel.js').default, 'findById').mockResolvedValue({ email: 'a@b.com', isAdmin: true });
        await protectRoute(req, mockRes, next);
        expect(next).toHaveBeenCalled();
    });

    it('rejects non-admin in isAdminRoute', () => {
        const req = { user: { isAdmin: false } };
        isAdminRoute(req, mockRes, next);
        expect(mockRes.status).toHaveBeenCalledWith(401);
    });
});
