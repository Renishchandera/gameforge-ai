const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/project.controller");

// Manual project creation
router.post("/", auth, controller.createProjectManual);

// Create project from idea
router.post("/from-idea/:ideaId", auth, controller.createProjectFromIdea);

// Basic CRUD
router.get("/", auth, controller.getProjects);
router.get("/:id", auth, controller.getProjectById);
router.put("/:id", auth, controller.updateProject);
router.delete("/:id", auth, controller.deleteProject);

// New routes
router.patch("/:id/status", auth, controller.updateProjectStatus);
router.get("/:id/stats", auth, controller.getProjectStats);

module.exports = router;