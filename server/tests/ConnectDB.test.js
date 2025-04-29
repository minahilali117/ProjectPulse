import mongoose from 'mongoose';
import dbConnection from '../utils/connectDB.js';

jest.mock('mongoose');

describe('dbConnection', () => {
    it('should connect to MongoDB successfully', async () => {
        mongoose.connect.mockResolvedValueOnce('Connected');
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        await dbConnection();

        expect(mongoose.connect).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('Database Connected');
    });

    it('should handle MongoDB connection failure', async () => {
        mongoose.connect.mockRejectedValueOnce(new Error('Connection failed'));
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        await dbConnection();

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('DB Error:'));
    });
});
