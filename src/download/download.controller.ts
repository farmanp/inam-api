import { Response } from 'express';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { UploadService } from '../upload/upload.service';

@Controller('download')
export class DownloadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get(':filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const fileStream = await this.uploadService.getFile(filename);
      res.header('Content-Disposition', `attachment; filename=${filename}`);
      fileStream.pipe(res);
    } catch (error) {
      console.error('Error while downloading:', error);
      res.status(500).send('Error while downloading the file.');
    }
  }
}
