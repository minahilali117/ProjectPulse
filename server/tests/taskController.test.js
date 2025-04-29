import {
    createTask,
    duplicateTask,
    updateTask,
    updateTaskStage,
    updateSubTaskStage,
    createSubTask,
    getTasks,
    getTask,
    postTaskActivity,
    trashTask,
    deleteRestoreTask,
    dashboardStatistics,
} from "../controllers/taskController.js";

import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import Notice from "../models/notis.js";

// Mocks
jest.mock("../models/taskModel.js");
jest.mock("../models/userModel.js");
jest.mock("../models/notis.js");

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("taskController", () => {
    afterEach(() => jest.clearAllMocks());

    it("createTask - should create task and notices", async () => {
        const req = {
            user: { userId: "123" },
            body: {
                title: "Test Task",
                team: ["123", "456"],
                stage: "Todo",
                date: new Date(),
                priority: "High",
                assets: [],
                links: "http://link.com,http://another.com",
                description: "Desc",
            },
        };

        const saveMock = jest.fn();
        Task.create.mockResolvedValue({ _id: "task123" });
        Notice.create.mockResolvedValue({});
        User.find.mockResolvedValue([{ _id: "123" }, { _id: "456" }]);
        User.findByIdAndUpdate.mockResolvedValue({});

        const res = mockRes();
        await createTask(req, res);
        expect(Task.create).toHaveBeenCalled();
        expect(Notice.create).toHaveBeenCalled();
        expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(2);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("duplicateTask - should duplicate a task", async () => {
        const req = {
            user: { userId: "321" },
            params: { id: "taskId" },
        };
        const mockTask = {
            _id: "taskId",
            team: ["123", "456"],
            subTasks: [],
            assets: [],
            links: [],
            priority: "low",
            stage: "todo",
            description: "desc",
            date: new Date(),
            title: "Original Task",
        };

        Task.findById.mockResolvedValue(mockTask);
        Task.create.mockResolvedValue({ ...mockTask, save: jest.fn() });
        Notice.create.mockResolvedValue({});

        const res = mockRes();
        await duplicateTask(req, res);
        expect(Task.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("updateTask - should update task fields", async () => {
        const req = {
            params: { id: "taskId" },
            body: {
                title: "Updated",
                date: new Date(),
                priority: "Low",
                stage: "Done",
                assets: [],
                links: "link1,link2",
                team: ["1"],
                description: "desc",
            },
        };
        const save = jest.fn();
        Task.findById.mockResolvedValue({ save });

        const res = mockRes();
        await updateTask(req, res);
        expect(save).toHaveBeenCalled();
    });

    it("updateTaskStage - should update stage", async () => {
        const req = { params: { id: "taskId" }, body: { stage: "In Progress" } };
        const save = jest.fn();
        Task.findById.mockResolvedValue({ save });

        const res = mockRes();
        await updateTaskStage(req, res);
        expect(save).toHaveBeenCalled();
    });

    it("updateSubTaskStage - should update subTask", async () => {
        const req = {
            params: { taskId: "t1", subTaskId: "s1" },
            body: { status: true },
        };
        Task.findOneAndUpdate.mockResolvedValue({});

        const res = mockRes();
        await updateSubTaskStage(req, res);
        expect(Task.findOneAndUpdate).toHaveBeenCalled();
    });

    it("createSubTask - should push subtask", async () => {
        const req = {
            params: { id: "t1" },
            body: { title: "Sub", date: new Date(), tag: "tag" },
        };
        const save = jest.fn();
        Task.findById.mockResolvedValue({ subTasks: [], save });

        const res = mockRes();
        await createSubTask(req, res);
        expect(save).toHaveBeenCalled();
    });

    it("getTasks - admin true", async () => {
        const req = { user: { userId: "1", isAdmin: true }, query: {} };
        Task.find.mockReturnValue({ populate: jest.fn().mockReturnThis(), sort: jest.fn().mockResolvedValue([]) });

        const res = mockRes();
        await getTasks(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("getTask - should return a task", async () => {
        const req = { params: { id: "t1" } };
        Task.findById.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue({}),
        });

        const res = mockRes();
        await getTask(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("postTaskActivity - should add activity", async () => {
        const req = {
            params: { id: "task1" },
            user: { userId: "u1" },
            body: { type: "comment", activity: "A comment" },
        };
        const save = jest.fn();
        Task.findById.mockResolvedValue({ activities: [], save });

        const res = mockRes();
        await postTaskActivity(req, res);
        expect(save).toHaveBeenCalled();
    });

    it("trashTask - should mark task trashed", async () => {
        const req = { params: { id: "tid" } };
        const save = jest.fn();
        Task.findById.mockResolvedValue({ isTrashed: false, save });

        const res = mockRes();
        await trashTask(req, res);
        expect(save).toHaveBeenCalled();
    });

    it("deleteRestoreTask - delete", async () => {
        const req = { params: { id: "t1" }, query: { actionType: "delete" } };
        const res = mockRes();

        Task.findByIdAndDelete.mockResolvedValue({});
        await deleteRestoreTask(req, res);
        expect(Task.findByIdAndDelete).toHaveBeenCalled();
    });

    it("deleteRestoreTask - restore", async () => {
        const req = { params: { id: "t1" }, query: { actionType: "restore" } };
        const save = jest.fn();
        Task.findById.mockResolvedValue({ isTrashed: true, save });

        const res = mockRes();
        await deleteRestoreTask(req, res);
        expect(save).toHaveBeenCalled();
    });

    it("dashboardStatistics - for admin", async () => {
        const req = { user: { userId: "u1", isAdmin: true } };
        Task.find.mockResolvedValue([]);
        User.find.mockResolvedValue([]);

        const res = mockRes();
        await dashboardStatistics(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
