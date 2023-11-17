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
import { ChannelService } from './channel.service';
import { UserGuard } from 'src/guards/user.guard';
import { CreateChannelDto } from 'src/dto/channel-dto/create-channel.dto';
import { UpdateChannelDto } from 'src/dto/channel-dto/update-des-channel';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @UseGuards(UserGuard)
  @Get('get/:id')
  getChannel(@Param('id') id: string) {
    return this.channelService.getChannel(id);
  }

  @UseGuards(UserGuard)
  @Post('create')
  createChannel(@Body() createChannel: CreateChannelDto, @Request() req) {
    return this.channelService.createChannel(createChannel, req);
  }

  @UseGuards(UserGuard)
  @Put('edit/:id')
  updateChannel(
    @Param('id') id: string,
    @Body() updateChannel: UpdateChannelDto,
    @Request() req,
  ) {
    return this.channelService.updateChannel(id, updateChannel, req);
  }

  @UseGuards(UserGuard)
  @Delete('delete/:id')
  delete(@Param('id') id: string, @Request() req) {
    return this.channelService.delete(id, req);
  }
}
