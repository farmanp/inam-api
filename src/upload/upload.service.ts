import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { Stream } from 'stream';

@Injectable()
export class UploadService implements OnModuleInit {
  private minioClient: Client;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.minioClient = new Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT'),
      port: +this.configService.get<number>('MINIO_PORT'),
      useSSL: false, // Set true if you're using SSL on MinIO
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
    });
  }

  async listFiles(): Promise<any> {
    return new Promise((resolve, reject) => {
      const stream = this.minioClient.listObjects('test', '', true);
      const results = [];
      stream.on('data', obj => results.push(obj));
      stream.on('error', err => reject(err));
      stream.on('end', () => resolve(results));
    });
  }

  async searchFiles(query: string): Promise<any> {
    const list = await this.listFiles(); // Assuming listFiles gets the list you've shown.
    return list.filter((file) =>
      file.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  async getFile(filename: string): Promise<Stream> {
    return this.minioClient.getObject('test', filename);
}

  // You can add more methods related to uploading, deleting, etc. as needed
  // For example:

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