const request = require('supertest');
const app = require('../index.js');

describe('Auth Routes', () => {
    it('should respond to GET /api/auth/test', async () => {
        const res = await request(app).get('/api/auth/test');
        expect(res.statusCode).toBe(404); // or 200 if you’ve defined a test route
    });
});
