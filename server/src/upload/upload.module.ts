import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from 'src/entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobEntity])],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
