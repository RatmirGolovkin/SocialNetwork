import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostGroupService } from './post-group.service';
import { UserGuard } from 'src/guards/user.guard';
import { CreatePostGroupDto } from 'src/dto/post-group-dto/create-post-group.dto';
import { UpdatePostGroupDto } from 'src/dto/post-group-dto/update-post-group.dto';

@Controller('post-group')
export class PostGroupController {
  constructor(private readonly postGroupService: PostGroupService) {}

  @UseGuards(UserGuard)
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postGroupService.getPost(id);
  }

  @UseGuards(UserGuard)
  @Post(':groupId/create')
  createPost(
    @Param('groupId') groupId: string,
    @Body() postGroupDto: CreatePostGroupDto,
    @Request() req,
  ) {
    return this.postGroupService.createPost(groupId, postGroupDto, req);
  }

  @UseGuards(UserGuard)
  @Put('update/:postId')
  updatePost(
    @Param('postId') postId: string,
    @Body() updateGroupPost: UpdatePostGroupDto,
    @Request() req,
  ) {
    return this.postGroupService.updatePost(postId, updateGroupPost, req);
  }

  @UseGuards(UserGuard)
  @Delete('delete/:postId')
  deletePost(@Param('postId') postId: string, @Request() req) {
    return this.postGroupService.deletePost(postId, req);
  }
}
