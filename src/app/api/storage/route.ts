import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "default",
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY || '',
    secretAccessKey: process.env.LIARA_SECRET_KEY || '',
  },
});

export async function POST(req: Request) {
  try {
    const { data, type } = await req.json();
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    const filename = `${type}_${timestamp}.json`;

    // 1. Local Storage
    const storageDir = path.join(process.cwd(), 'storage', type, date);
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    const filePath = path.join(storageDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    // 2. Liara Space (Cloud) Storage
    if (process.env.LIARA_ACCESS_KEY) {
      try {
        const command = new PutObjectCommand({
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: `${type}/${date}/${filename}`,
          Body: JSON.stringify(data),
          ContentType: "application/json",
        });
        await s3Client.send(command);
        console.log(`Uploaded ${filename} to Liara Space`);
      } catch (s3Error) {
        console.error("Liara Space upload failed:", s3Error);
        // We continue because local storage succeeded
      }
    }

    return NextResponse.json({
      success: true,
      path: filePath,
      cloudPath: `${process.env.LIARA_BUCKET_NAME}/${type}/${date}/${filename}`
    });
  } catch (error) {
    console.error('Storage error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
