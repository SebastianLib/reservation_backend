import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, Res } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FileEntity } from './entities/upload.entity';
import { join } from 'path';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }

  @Post('files')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>): Promise<{
    ids: number[];
  }> {
    if (!files || files.length === 0) { 
      throw new BadRequestException('Brak przesłanych plików');
    }
    const savedFiles: FileEntity[] = await Promise.all(files.map(file => this.uploadsService.saveFile(file)));
    const ids = savedFiles.map(file => file.id);
    return { ids };
  }

  @Get('test-upload/:filename')
  getUploadedFile(@Param('filename') filename: string, @Res() res) {
    const filePath = join(__dirname, '..', '..', '..', 'uploads', filename);
    return res.sendFile(filePath);
  }
  @Get()
  findAll() {
    return this.uploadsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<FileEntity> {
    return this.uploadsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadsService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadsService.remove(+id);
  }
}
