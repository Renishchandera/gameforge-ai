const axios = require("axios");

const aiLLMClient = axios.create({
  baseURL: process.env.AI_LLM_SERVICE_URL, // http://localhost:7000
  timeout: 30000,
  headers: {
    "x-internal-key": process.env.AI_LLM_INTERNAL_KEY,
    "Content-Type": "application/json",
  },
});

module.exports = aiLLMClient;
