import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import {
  allowedExtensions,
  maxFileSizeInBytes,
} from 'src/common/consts/upload.consts';
import { UploadService } from './upload.service';
import { Response } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('upload-csv')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
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
      const data = await this.uploadService.uploadFile(file);
      res.send(data).status(HttpStatus.OK);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
