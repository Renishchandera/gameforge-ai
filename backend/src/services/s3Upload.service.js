// services/s3Upload.service.js
const { s3Client, S3_BUCKET_NAME, S3_DOCUMENTS_FOLDER } = require("../config/s3.config");
const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

class S3UploadService {
  /**
   * Upload file to S3
   */
  async uploadFile(file, projectId, userId, category = "document") {
    try {
      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const s3Key = `${S3_DOCUMENTS_FOLDER}/${projectId}/${category}/${fileName}`;

      const uploadParams = {
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          projectId,
          userId,
          originalName: file.originalname,
          category
        }
      };

      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      // REMOVED: Don't generate public URL
      // Just return the S3 key
      return {
        s3Key,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype
      };
    } catch (error) {
      console.error("S3 upload error:", error);
      throw new Error("Failed to upload file to S3");
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(s3Key) {
    try {
      const deleteParams = {
        Bucket: S3_BUCKET_NAME,
        Key: s3Key
      };

      const command = new DeleteObjectCommand(deleteParams);
      await s3Client.send(command);
      
      return true;
    } catch (error) {
      console.error("S3 delete error:", error);
      throw new Error("Failed to delete file from S3");
    }
  }

  /**
   * Generate pre-signed URL for temporary access
   */
  async getSignedUrl(s3Key, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: s3Key
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      console.error("Generate signed URL error:", error);
      throw new Error("Failed to generate signed URL");
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(files, projectId, userId, category = "document") {
    const uploadPromises = files.map(file => 
      this.uploadFile(file, projectId, userId, category)
    );
    
    return Promise.all(uploadPromises);
  }
}

module.exports = new S3UploadService();