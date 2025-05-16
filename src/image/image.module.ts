import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Image } from './entities/image.entity';  

@Module({
  imports: [TypeOrmModule.forFeature([Image])], 
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService, TypeOrmModule], 
})
export class ImageModule {}
