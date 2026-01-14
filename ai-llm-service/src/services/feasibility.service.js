const llm = require("../providers");
const feasibilityPrompt = require("../prompts/feasibility.prompt");

async function checkFeasibility(idea) {
  const response = await llm.generate(
    feasibilityPrompt({ idea })
  );
  return JSON.parse(response);
}

module.exports = { checkFeasibility };
