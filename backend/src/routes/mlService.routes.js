const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/mlService.controller");


router.post("/predict-success/:projectId", auth, controller.predictProjectSuccess);

module.exports = router;