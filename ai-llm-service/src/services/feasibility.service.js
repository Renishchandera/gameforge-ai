const llm = require("../providers");
const feasibilityPrompt = require("../prompts/feasibility.prompt");

async function checkFeasibility(idea) {
  const response = await llm.generateFeasibility(
    feasibilityPrompt({ idea })
  );
  return response;
}

module.exports = { checkFeasibility };
