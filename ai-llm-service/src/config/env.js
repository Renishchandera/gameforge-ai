require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 7000,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  LLM_TIMEOUT: 25000,
};
