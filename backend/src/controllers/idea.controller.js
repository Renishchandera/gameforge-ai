const aiLLMClient = require("../services/aiLLM.client");

exports.generateIdea = async (req, res) => {
  const response = await aiLLMClient.post(
    "/ai/idea/generate",
    req.body
  );

  res.json(response.data);
};

exports.checkFeasibility = async (req, res) => {
  const response = await aiLLMClient.post(
    "/ai/idea/feasibility",
    { idea: req.body.idea }
  );

  res.json(response.data);
};
