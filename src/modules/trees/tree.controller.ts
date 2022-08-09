import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { TreeService } from './tree.service';
import { JWTGuard } from 'src/jwt/jwt.guard';
import { CreateTreeDto } from './dto/create.tree.dto copy';
import { UpdateTreeDto } from './dto/update.tree.dto';

@Controller('trees')
export class TreeController {
  constructor(private readonly treeSevice: TreeService) {}

  @Get()
  @UseGuards(JWTGuard)
  async getAllTrees(@Session() session: Record<string, any>) {
    console.log('controller: get all trees by user id');
    const { userId } = session;
    return this.treeSevice.getAllTreesByUserId(userId);
  }

  @Post()
  @UseGuards(JWTGuard)
  async createTree(
    @Body() dto: CreateTreeDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      const { userId } = session;
      return this.treeSevice.createTree(dto, userId);
    } catch (error) {
      console.log(error);
    }
  }

  @Put(':id')
  @UseGuards(JWTGuard)
  async updateTree(
    @Param('id') id: string,
    @Body() dto: UpdateTreeDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      const { userId } = session;
      return this.treeSevice.updateTree(dto, userId, id);
    } catch (error) {
      console.log(error);
    }
  }
}
