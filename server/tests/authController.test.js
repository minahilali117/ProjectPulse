// tests/authController.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import index from '../index.js';
import User from '../models/userModel.js';
import { activateUserProfile, registerUser, loginUser, logoutUser } from '../controllers/userController.js';

describe('Auth Controller', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('registers a new user', async () => {
        const res = await request(index)
            .post('/api/users/register')
            .send({
                name: 'Test',
                title: 'Dev',
                role: 'member',
                email: 'test@example.com',
                password: 'password123',
            });
        expect(res.status).toBe(201);
        expect(res.body.email).toBe('test@example.com');
    });

    it('rejects duplicate email', async () => {
        const res = await request(index)
            .post('/api/users/register')
            .send({
                name: 'Test2',
                title: 'Dev',
                role: 'member',
                email: 'test@example.com',
                password: 'password123',
            });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/already exists/i);
    });
});
