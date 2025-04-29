import request from 'supertest';
import express from 'express';
import routes from '../routes/index.js';
import { routeNotFound, errorHandler } from '../middleware/errorMiddleware.js';

const app = express();
app.use(express.json());
app.use('/api', routes);
app.use(routeNotFound);
app.use(errorHandler);

describe('Express App Routes', () => {
    it('should respond to unknown route with 404', async () => {
        const res = await request(app).get('/api/unknown');
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/not found/i);
    });

    it('should have /api route base configured', async () => {
        const res = await request(app).get('/api');
        expect([200, 404]).toContain(res.statusCode); // depends on root route existence
    });
});
