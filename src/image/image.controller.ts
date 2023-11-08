import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { UserGuard } from 'src/guards/user.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly imgService: ImageService) {}

  // Get Image //
  @UseGuards(UserGuard)
  @Get('get/:name')
  getFile(@Param('name') name: string, @Request() req) {
    return this.imgService.getFile(name, req);
  }

  // Upload image //
  @UseGuards(UserGuard)
  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('uploadFile'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.imgService.uploadAvatarImage(file, req);
  }

  // Upload post image
  @UseGuards(UserGuard)
  @Post('upload/post/:postId')
  @UseInterceptors(FileInterceptor('uploadFile'))
  uploadPostFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Param('postId') postId: string,
  ) {
    return this.imgService.uploadPostImage(file, req, postId);
  }

  // Upload comment image
  @UseGuards(UserGuard)
  @Post('upload/comment/:commentId')
  @UseInterceptors(FileInterceptor('uploadFile'))
  uploadCommentFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Param('commentId') commentId: string,
  ) {
    return this.imgService.uploadCommentImage(file, req, commentId);
  }

  // delete image
  @UseGuards(UserGuard)
  @Delete('delete/:id')
  delete(@Param('id') id: string, @Request() req) {
    return this.imgService.delete(id, req);
  }
}
