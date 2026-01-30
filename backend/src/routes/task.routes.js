const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/task.controller");

// Project-scoped routes
router.post("/projects/:projectId/tasks", auth, controller.createTask);
router.get("/projects/:projectId/tasks", auth, controller.getProjectTasks);

// Task-scoped routes
router.put("/tasks/:taskId", auth, controller.updateTask);
router.delete("/tasks/:taskId", auth, controller.deleteTask);

module.exports = router;
