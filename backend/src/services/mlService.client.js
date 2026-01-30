const axios = require("axios");

const mlServiceClient = axios.create({
  baseURL: process.env.ML_SERVICE_URL,
  timeout: 30000,
  headers: {
    "x-internal-key": process.env.ML_SERVICE_INTERNAL_KEY,
    "Content-Type": "application/json",
  },
});

module.exports = mlServiceClient;
