import {
  Body,
  Controller,
  UseGuards,
  Post,
  Param,
  Request,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { UserGuard } from 'src/guards/user.guard';
import { CreateCommentDto } from 'src/dto/comment-dto/comment.dto';
import { UpdateCommentDto } from 'src/dto/comment-dto/update-comment';

// Edit comment, Delete comment, Get all user comment //

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  // Get
  @UseGuards(UserGuard)
  @Get('get/:commentId')
  getComment(@Param('commentId') commentId: string) {
    return this.commentService.getComment(commentId);
  }

  // Post comment
  @UseGuards(UserGuard)
  @Post('create/:id')
  createComment(
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentService.createComment(postId, createCommentDto, req);
  }

  // Update comment text
  @UseGuards(UserGuard)
  @Put('edit/:commentId')
  editComment(
    @Param('commentId') commentId: string,
    @Request() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.editComment(commentId, req, updateCommentDto);
  }

  // Delete comment //
  @UseGuards(UserGuard)
  @Delete('delete/:id')
  deleteComment(@Param('id') id: string, @Request() req) {
    return this.commentService.deleteComment(id, req);
  }
}
