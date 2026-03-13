// config/s3.config.js
const { S3Client } = require("@aws-sdk/client-s3");
// const { fromEnv } = require("@aws-sdk/credential-providers");
require("dotenv").config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const S3_DOCUMENTS_FOLDER = "project-documents";

module.exports = { s3Client, S3_BUCKET_NAME, S3_DOCUMENTS_FOLDER };