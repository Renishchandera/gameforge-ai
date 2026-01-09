const router = require("express").Router();
const { register, login,refreshToken, logout } = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware")


router.post("/register", register);
router.post("/login", login);
router.get("/login", (req, res)=>{
    res.json({message: "Get Login Working"});
});
router.post("/logout", logout);
router.post("/refresh", refreshToken);

module.exports = router;
