import { BadRequestException, Injectable } from '@nestjs/common';
import CSVFileValidator from 'csv-file-validator';

@Injectable()
export class UploadService {
  async uploadFile(file): Promise<void> {}
}
