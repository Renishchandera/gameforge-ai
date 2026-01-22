module.exports = ({ 
  genre, 
  platform, 
  targetAudience, 
  coreMechanic, 
  artStyle, 
  monetization 
}) => `
You are a senior game designer creating a practical, innovative game idea.

INPUT SPECIFICATIONS:
- Genre: ${genre}
- Platform: ${platform}
- Target Audience: ${targetAudience}
- Core Mechanic: ${coreMechanic}
- Art Style: ${artStyle}
- Monetization: ${monetization}

IMPORTANT INSTRUCTIONS:
1. Be concise and practical - focus on what could actually be developed
2. Use clean, plain text formatting (NO markdown like ** or *)
3. Keep each section focused and to the point
4. Output should be ready to display directly

REQUIRED OUTPUT FORMAT:
TITLE: [Create a memorable game title]

GENRE & PLATFORM: ${genre} game for ${platform}

ELEVATOR PITCH:
[One compelling paragraph that captures the game's essence]

CORE GAMEPLAY LOOP IN POINTS:
- [First key gameplay activity]
- [Second key gameplay activity] 
- [Third key gameplay activity]
- [...]

KEY FEATURES:
1. [Most innovative feature]
2. [Core gameplay feature]
3. [Unique selling point]

VISUAL & AUDIO STYLE:
[Brief description of art direction and sound design]

MONETIZATION STRATEGY:
[How ${monetization} would be implemented]

TARGET AUDIENCE FIT:
[Why this appeals specifically to ${targetAudience}]

DEVELOPMENT CONSIDERATIONS:
[Main technical or design challenges to consider]
`;