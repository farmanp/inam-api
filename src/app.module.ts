import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadController } from './upload/upload.controller';
import { UploadService } from './upload/upload.service';
import { SearchController } from './search/search.controller';
import { DownloadController } from './download/download.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes the .env file variables globally accessible
      envFilePath: '.env', // pointing to default .env file
    }),
  ],
  controllers: [
    AppController,
    UploadController,
    SearchController,
    DownloadController,
  ],
  providers: [AppService, UploadService],
})
export class AppModule {}
