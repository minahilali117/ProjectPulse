// tests/userModel.test.js
require('dotenv').config({ path: '.env.test' });
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

describe('User Model', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
    });
    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('hashes password on save', async () => {
        const user = new User({ name: 'X', title: 'T', role: 'r', email: 'x@x.com', password: 'pass' });
        await user.save();
        expect(user.password).not.toBe('pass');
        expect(await bcrypt.compare('pass', user.password)).toBe(true);
    });
});
