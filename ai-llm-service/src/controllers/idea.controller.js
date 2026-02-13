const { generateIdea } = require("../services/idea.service");
const { checkFeasibility } = require("../services/feasibility.service");

exports.generateIdea = async (req, res, next) => {
  try {
    // req.body now contains arrays (genres, platforms)
    const idea = await generateIdea(req.body);
    res.json({ idea });
  } catch (err) {
    next(err);
  }
};

exports.feasibility = async (req, res, next) => {
  try {
    const result = await checkFeasibility(req.body.idea);
    res.json(result);
  } catch (err) {
    next(err);
  }
};