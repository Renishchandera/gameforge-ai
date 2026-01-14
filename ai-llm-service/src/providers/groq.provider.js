const Groq = require("groq-sdk");
const { GROQ_API_KEY } = require("../config/env");

const groq = new Groq({ apiKey: GROQ_API_KEY });

async function generate(prompt) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  return completion.choices[0]?.message.content;
}

module.exports = { generate };
