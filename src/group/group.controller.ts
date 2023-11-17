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
import { GroupService } from './group.service';
import { UserGuard } from 'src/guards/user.guard';
import { CreateGroupDto } from 'src/dto/group-dto/create-group.dto';
import { UpdateDescriptionGroupDto } from 'src/dto/group-dto/update-des-group';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(UserGuard)
  @Get('get/:id')
  getGroup(@Param('id') id: string, @Request() req) {
    return this.groupService.getGroup(id, req);
  }

  @UseGuards(UserGuard)
  @Post('create')
  createGroup(@Body() createGroup: CreateGroupDto, @Request() req) {
    return this.groupService.createGroup(createGroup, req);
  }

  @UseGuards(UserGuard)
  @Put('edit/description/:id')
  updateDescription(
    @Body() updateDescription: UpdateDescriptionGroupDto,
    @Request() req,
    @Param('id') id: string,
  ) {
    return this.groupService.updateDescription(updateDescription, req, id);
  }

  @UseGuards(UserGuard)
  @Delete('delete/:id')
  delete(@Param('id') id: string, @Request() req) {
    return this.groupService.delete(id, req);
  }
}
