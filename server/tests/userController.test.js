// tests/userController.test.js
import { jest } from "@jest/globals";
import mongoose from "mongoose";
import {
    loginUser,
    registerUser,
    logoutUser,
    getTeamList,
    getNotificationsList,
    getUserTaskStatus,
    markNotificationRead,
    updateUserProfile,
    activateUserProfile,
} from "../controllers/userController.js";
import User from "../models/userModel.js";
import Notice from "../models/notis.js";
import createJWT from "../utils/index.js";

// Mock modules
jest.mock("../models/userModel.js");
jest.mock("../models/notis.js");
jest.mock("../utils/index.js", () => jest.fn());

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn();
    return res;
};

describe("userController", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("loginUser", () => {
        it("should return 401 for non-existent user", async () => {
            const req = { body: { email: "test@example.com", password: "123456" } };
            const res = mockRes();
            User.findOne.mockResolvedValue(null);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: false,
                message: "Invalid email or password.",
            });
        });

        it("should return 401 for inactive user", async () => {
            const req = { body: { email: "test@example.com", password: "123456" } };
            const res = mockRes();
            const user = { isActive: false };
            User.findOne.mockResolvedValue(user);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
        });

        it("should login valid user", async () => {
            const req = { body: { email: "test@example.com", password: "123456" } };
            const res = mockRes();
            const user = {
                _id: "user123",
                isActive: true,
                matchPassword: jest.fn().mockResolvedValue(true),
            };
            User.findOne.mockResolvedValue(user);

            await loginUser(req, res);

            expect(createJWT).toHaveBeenCalledWith(res, user._id);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("registerUser", () => {
        it("should not allow duplicate email", async () => {
            const req = { body: { email: "test@example.com" } };
            const res = mockRes();
            User.findOne.mockResolvedValue(true);

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should register and return user", async () => {
            const req = { body: { name: "User", email: "a@b.com", password: "pass" } };
            const res = mockRes();
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({ ...req.body, _id: "id" });

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe("logoutUser", () => {
        it("should clear token", () => {
            const res = mockRes();
            logoutUser({}, res);

            expect(res.cookie).toHaveBeenCalledWith("token", "", expect.anything());
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("getTeamList", () => {
        it("should return filtered users", async () => {
            const req = { query: { search: "dev" } };
            const res = mockRes();
            User.find.mockReturnValueOnce({ select: jest.fn().mockResolvedValue([]) });

            await getTeamList(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe("getNotificationsList", () => {
        it("should return notices", async () => {
            const req = { user: { userId: "123" } };
            const res = mockRes();
            Notice.find.mockReturnValueOnce({
                populate: () => ({
                    sort: jest.fn().mockResolvedValue([]),
                }),
            });

            await getNotificationsList(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("getUserTaskStatus", () => {
        it("should return tasks", async () => {
            const req = {};
            const res = mockRes();
            User.find.mockReturnValueOnce({
                populate: () => ({
                    sort: jest.fn().mockResolvedValue([]),
                }),
            });

            await getUserTaskStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("markNotificationRead", () => {
        it("should mark all as read", async () => {
            const req = { user: { userId: "123" }, query: { isReadType: "all" } };
            const res = mockRes();
            Notice.updateMany.mockResolvedValue({});

            await markNotificationRead(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
        });

        it("should mark one as read", async () => {
            const req = { user: { userId: "123" }, query: { isReadType: "single", id: "abc" } };
            const res = mockRes();
            Notice.findOneAndUpdate.mockResolvedValue({});

            await markNotificationRead(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe("updateUserProfile", () => {
        it("should update profile", async () => {
            const req = {
                user: { userId: "1", isAdmin: true },
                body: { _id: "1", name: "Updated" },
            };
            const res = mockRes();
            const save = jest.fn().mockResolvedValue({ name: "Updated" });
            User.findById.mockResolvedValue({ save });

            await updateUserProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe("activateUserProfile", () => {
        it("should activate user", async () => {
            const req = { params: { id: "1" }, body: { isActive: true } };
            const res = mockRes();
            const save = jest.fn().mockResolvedValue({});
            User.findById.mockResolvedValue({ isActive: false, save });

            await activateUserProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
        });
    });
});
