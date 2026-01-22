module.exports = ({ idea }) => `
Analyze this game idea for feasibility.

IDEA TO ANALYZE:
${idea}

ANALYSIS CRITERIA:
1. Market Viability (25 points): Competition, target audience size, market trends
2. Technical Feasibility (25 points): Platform suitability, complexity, required tech
3. Financial Viability (25 points): Cost vs revenue potential, monetization fit
4. Development Feasibility (25 points): Team requirements, timeline risks, resource needs

OUTPUT FORMAT - Return only valid JSON:
{
  "score": number,
  "reasoning": "Brief summary of overall assessment",
  "risks": ["Risk 1", "Risk 2", "Risk 3"]
}

Be direct and realistic. Focus on practical concerns.
`;