const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/idea.controller");

router.post("/generate", auth, controller.generateIdea);
router.post("/feasibility", auth, controller.checkFeasibility);

module.exports = router;
