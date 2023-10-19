import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { UserGuard } from '../guards/user.guard';
import { CreatePostDto } from '../dto/post-dto/create-post.dto';
import { UpdatePostDto } from 'src/dto/post-dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Get All //
  @UseGuards(UserGuard)
  @Get('all')
  getAllPosts(@Req() req) {
    return this.postService.getAllPosts(req);
  }

  // Create post //
  @UseGuards(UserGuard)
  @Post('create')
  createPost(@Body() createPost: CreatePostDto, @Req() req) {
    return this.postService.createPost(createPost, req);
  }

  // Update Post //
  @UseGuards(UserGuard)
  @Put('update')
  udatePost(@Body() updatePost: UpdatePostDto, @Request() req) {
    return this.postService.updatePost(updatePost, req);
  }

  // Delete //
  @UseGuards(UserGuard)
  @Delete('delete/:postname')
  deletePost(@Param('postname') postName: string, @Request() req) {
    return this.postService.deletePost(postName, req);
  }
}
