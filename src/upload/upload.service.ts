// src/upload/upload.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { Client } from 'minio';
import * as multerS3 from 'multer-s3';

@Injectable()
export class UploadService {
  private readonly gcsClient: Storage;
  private readonly minioClient: Client;

  constructor(private readonly configService: ConfigService) {
    this.gcsClient = new Storage({
      projectId: this.configService.get<string>('GCS_PROJECT_ID'),
      credentials: {
        client_email: this.configService.get<string>('GCS_CLIENT_EMAIL'),
        private_key: this.configService.get<string>('GCS_PRIVATE_KEY'),
      },
    });

    this.minioClient = new Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT'),
      port: +this.configService.get<number>('MINIO_PORT'),
      useSSL: false, // Set true if you're using SSL on MinIO
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
    });
  }

  getGcsMulterConfig() {
    const bucketName = this.configService.get<string>('GCS_BUCKET_NAME');
    const bucket = this.gcsClient.bucket(bucketName);

    return {
      storage: multerS3({
        s3: bucket,
        bucket: bucketName,
        acl: 'public-read', // Make sure to set your permissions
        key: (req, file, cb) => {
          cb(null, Date.now().toString() + file.originalname);
        },
      }),
    };
  }

  getMinioMulterConfig() {
    const bucketName = this.configService.get<string>('MINIO_BUCKET_NAME');

    return {
      storage: multerS3({
        s3: this.minioClient,
        bucket: bucketName,
        acl: 'public-read', // Make sure to set your permissions
        key: (req, file, cb) => {
          cb(null, Date.now().toString() + file.originalname);
        },
      }),
    };
  }

  async uploadFile(file) {
    const bucketName = this.configService.get<string>('MINIO_BUCKET_NAME');

    // Check if bucket already exists
    const bucketExists = await this.minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(bucketName, 'us-east-1'); // you can specify the appropriate region
    }

    await this.minioClient.putObject(bucketName, file.originalname, file.buffer);

    return { message: 'File uploaded successfully!' };
  }
}
