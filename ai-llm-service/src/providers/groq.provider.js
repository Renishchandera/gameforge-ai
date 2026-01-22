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

async function generateFeasibility(prompt) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ 
      role: "system", 
      content: "You are a feasibility analyst. Output ONLY valid JSON." 
    }, { 
      role: "user", 
      content: prompt 
    }],
    temperature: 0.3,
  });

  const content = completion.choices[0]?.message.content;
  try {
    return JSON.parse(content);
  } catch {
    // Fallback if JSON parsing fails
    const scoreMatch = content.match(/"score":\s*(\d+)/);
    const reasoningMatch = content.match(/"reasoning":\s*"([^"]+)"/);
    const risksMatch = content.match(/"risks":\s*\[(.*?)\]/);
    
    return {
      score: scoreMatch ? parseInt(scoreMatch[1]) : 50,
      reasoning: reasoningMatch ? reasoningMatch[1] : "Analysis completed",
      risks: risksMatch ? risksMatch[1].split(',').map(r => r.trim().replace(/"/g, '')) : []
    };
  }
}

module.exports = { generate, generateFeasibility };