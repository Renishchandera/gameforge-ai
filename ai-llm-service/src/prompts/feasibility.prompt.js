module.exports = ({ idea }) => `
You are a feasibility analyst.

Analyze this idea realistically.

${idea}

Return JSON ONLY:
{
  "score": number,
  "reasoning": string,
  "risks": [string]
}
`;
