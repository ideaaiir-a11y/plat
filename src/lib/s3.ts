import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
  forcePathStyle: true, // Required for many S3-compatible storages like Liara
});

export async function uploadToS3(key: string, body: string | Buffer, contentType: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    const response = await s3Client.send(command);
    console.log(`Successfully uploaded ${key} to S3`);
    return response;
  } catch (error) {
    console.error(`Error uploading ${key} to S3:`, error);
    throw error;
  }
}
