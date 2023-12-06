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
import { PostChannelService } from './post-channel.service';
import { UserGuard } from 'src/guards/user.guard';
import { CreatePostGroupDto } from 'src/dto/post-group-dto/create-post-group.dto';
import { UpdatePostGroupDto } from 'src/dto/post-group-dto/update-post-group.dto';

@Controller('post-channel')
export class PostChannelController {
  constructor(private readonly postChannelService: PostChannelService) {}

  @UseGuards(UserGuard)
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postChannelService.getPost(id);
  }

  @UseGuards(UserGuard)
  @Post(':channelId/create')
  createPost(
    @Param('channelId') channelId: string,
    @Body() postChannelDto: CreatePostGroupDto,
    @Request() req,
  ) {
    return this.postChannelService.createPost(channelId, postChannelDto, req);
  }

  @UseGuards(UserGuard)
  @Put('update/postId')
  updatePost(
    @Param('postId') postId: string,
    @Body() updatePostChannelDto: UpdatePostGroupDto,
    @Request() req,
  ) {
    return this.postChannelService.updatePost(
      postId,
      updatePostChannelDto,
      req,
    );
  }

  @UseGuards(UserGuard)
  @Delete('delete/postId')
  deletePost(@Param('postId') postId: string, @Request() req) {
    return this.postChannelService.deletePost(postId, req);
  }
}
