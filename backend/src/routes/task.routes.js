const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/task.controller");

// Project-scoped routes
router.post("/projects/:projectId/tasks", auth, controller.createTask);
router.get("/projects/:projectId/tasks", auth, controller.getProjectTasks);
router.get("/projects/:projectId/tasks/grouped", auth, controller.getTasksGroupedByStatus);

// Task-scoped routes
router.put("/tasks/:taskId", auth, controller.updateTask);
router.delete("/tasks/:taskId", auth, controller.deleteTask);

// New batch routes
router.patch("/tasks/batch/status", auth, controller.batchUpdateTaskStatus);

module.exports = router;