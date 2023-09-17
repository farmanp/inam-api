import { Controller, Get, Query } from '@nestjs/common';
import { UploadService } from '../upload/upload.service';

@Controller('search')
export class SearchController {
  constructor(private readonly uploadService: UploadService) {}

  @Get()
  async searchFiles(@Query('query') query: string) {
    return this.uploadService.searchFiles(query);
  }
}
