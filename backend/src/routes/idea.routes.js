const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/idea.controller");

router.post("/generate", auth, controller.generateIdea);
router.post("/feasibility", auth, controller.checkFeasibility);
router.post("/save", auth, controller.saveIdea);        // NEW
router.get("/saved", auth, controller.getSavedIdeas);   // NEW
module.exports = router;