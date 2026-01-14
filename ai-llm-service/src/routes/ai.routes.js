const router = require("express").Router();
const auth = require("../middlewares/internalAuth.middleware");
const controller = require("../controllers/idea.controller");

router.post("/idea/generate", auth, controller.generateIdea);
router.post("/idea/feasibility", auth, controller.feasibility);

module.exports = router;
