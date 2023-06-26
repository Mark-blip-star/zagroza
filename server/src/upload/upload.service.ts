import { BadRequestException, Injectable } from '@nestjs/common';
import * as csv from 'fast-csv';
import {
  firstAllowedArray,
  secondAllowedArray,
} from 'src/common/consts/upload.consts';
import * as stream from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { JobEntity } from 'src/entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const _ = require('lodash');
const folderPath = path.join(__dirname, '..', '..', 'src', 'common', 'csv');

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
  ) {}
  async uploadFile(file) {
    try {
      const { headers, data } = await this.isValidCsv(file.buffer);
      if (_.isEqual(headers, firstAllowedArray)) {
        await this.writeCsvToFileSystem(
          data,
          headers,
          folderPath,
          Date.now().toString(),
        );
        return {
          message: `CSV file written successfully`,
        };
      } else if (_.isEqual(headers, secondAllowedArray)) {
        const result = await this.bulkUpload(data);
        return result;
      } else {
        throw new BadRequestException(
          'The structure of the CSV is not allowed',
        );
      }
    } catch (error) {
      console.error('Error:', error.message);
      throw new BadRequestException(error.message);
    }
  }

  async bulkUpload(data: JobEntity[]): Promise<Object> {
    try {
      await this.jobRepository
        .createQueryBuilder()
        .insert()
        .into(JobEntity)
        .values(data)
        .execute();

      return {
        message: 'CSV files successfully uploaded to database',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async writeCsvToFileSystem(
    data: any[],
    headers: string[],
    folderPath: string,
    fileName: string,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const filePath = path.join(folderPath, `${fileName}.csv`);

      const writeStream = fs.createWriteStream(filePath);
      writeStream.on('finish', () => {
        resolve();
      });
      writeStream.on('error', (error) => {
        reject(error);
      });

      writeStream.write(headers.join(',') + '\n');
      data.forEach((row) => {
        writeStream.write(Object.values(row).join(',') + '\n');
      });

      writeStream.end();
    });
  }

  async isValidCsv(file) {
    return new Promise<{ headers: string[]; data: any[] }>(
      (resolve, reject) => {
        const rows: any[] = [];

        stream.Readable.from(file)
          .pipe(csv.parse({ headers: true }))
          .on('error', (error) => reject(error))
          .on('headers', (headers: string[]) => {
            resolve({ headers, data: rows });
          })
          .on('data', (row) => rows.push(row))
          .on('end', (rowCount: number) => {
            if (rowCount === 0) {
              reject(new Error('CSV text is empty.'));
            }
          });
      },
    );
  }
}
