const llm = require("../providers");
const ideaPrompt = require("../prompts/idea.prompt");

async function generateIdea(input) {
  return llm.generate(ideaPrompt(input));
}

module.exports = { generateIdea };
