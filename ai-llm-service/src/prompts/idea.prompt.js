module.exports = ({ 
  genres, 
  platforms, 
  targetAudience, 
  coreMechanic, 
  artStyle, 
  monetization 
}) => {
  // Format arrays nicely for the prompt
  const genresList = Array.isArray(genres) && genres.length > 0 
    ? genres.join(', ') 
    : genres || 'Not specified';
  
  const platformsList = Array.isArray(platforms) && platforms.length > 0 
    ? platforms.join(', ') 
    : platforms || 'Not specified';

  return `
You are a senior game designer creating a practical, innovative game idea.

INPUT SPECIFICATIONS:
- Genres: ${genresList}
- Platforms: ${platformsList}
- Target Audience: ${targetAudience || 'Not specified'}
- Core Mechanic: ${coreMechanic || 'Not specified'}
- Art Style: ${artStyle || 'Not specified'}
- Monetization: ${monetization || 'Not specified'}

IMPORTANT INSTRUCTIONS:
1. Be concise and practical - focus on what could actually be developed
2. Use clean, plain text formatting (NO markdown like ** or *)
3. Keep each section focused and to the point
4. Output should be ready to display directly
5. Combine elements from multiple genres/platforms creatively

REQUIRED OUTPUT FORMAT:
TITLE: [Create a memorable game title that reflects the genre combination]

GENRE & PLATFORM FUSION:
Primary Genre: ${Array.isArray(genres) ? genres[0] : genres} 
Additional Elements: ${Array.isArray(genres) && genres.length > 1 ? genres.slice(1).join(', ') : 'None'}
Target Platforms: ${platformsList}

ELEVATOR PITCH:
[One compelling paragraph that captures how the ${Array.isArray(genres) ? genres.join('/') : genres} mechanics work together on ${platformsList}]

CORE GAMEPLAY LOOP IN POINTS:
- [First key gameplay activity that leverages the primary genre]
- [Second key gameplay activity that incorporates secondary genre elements]
- [Third key gameplay activity unique to platform capabilities]
- [Additional mechanics that blend the genres]

KEY FEATURES:
1. [Most innovative feature combining multiple genres]
2. [Core gameplay feature leveraging platform strengths]
3. [Unique selling point that stands out in the market]

VISUAL & AUDIO STYLE:
[Brief description of art direction and sound design, considering ${artStyle || 'appropriate style'}]

MONETIZATION STRATEGY:
[How ${monetization || 'suitable monetization'} would be implemented for this genre blend]

TARGET AUDIENCE FIT:
[Why this appeals specifically to ${targetAudience || 'the target audience'}]

PLATFORM-SPECIFIC CONSIDERATIONS:
[How the game utilizes features of ${platformsList}]

DEVELOPMENT CONSIDERATIONS:
[Main technical or design challenges to consider for this genre combination]
`;
};