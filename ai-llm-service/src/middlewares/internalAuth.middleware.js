const { INTERNAL_API_KEY } = require("../config/env");

module.exports = (req, res, next) => {
  const key = req.headers["x-internal-key"];

  if (!key || key !== INTERNAL_API_KEY) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};
