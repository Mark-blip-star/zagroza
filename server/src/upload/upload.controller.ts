import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import {
  allowedExtensions,
  maxFileSizeInBytes,
} from 'src/common/consts/upload.consts';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('upload-csv')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (file.size > maxFileSizeInBytes) {
      throw new BadRequestException('File is too large(max 10mb)');
    }

    const fileExtension = '.' + file.originalname.split('.')[1];
    if (!allowedExtensions.includes(fileExtension.toLocaleLowerCase())) {
      throw new BadRequestException('CSV files only');
    }
    return await this.uploadService.uploadFile(file);
  }
}
