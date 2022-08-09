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
import { TObjectId } from 'src/types';
import { mongoose } from '@typegoose/typegoose';

@Controller('trees')
export class TreeController {
  constructor(private readonly treeSevice: TreeService) {}

  @Get()
  @UseGuards(JWTGuard)
  async getAllTrees(@Session() session: Record<string, any>) {
    const userId: TObjectId = new mongoose.Types.ObjectId(session.userId);
    return this.treeSevice.getAllTreesByUserId(userId);
  }

  @Post()
  @UseGuards(JWTGuard)
  async createTree(
    @Body() dto: CreateTreeDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      const userId: TObjectId = new mongoose.Types.ObjectId(session.userId);
      return this.treeSevice.createTree(dto, userId);
    } catch (error) {
      console.log(error);
    }
  }

  @Put(':id')
  @UseGuards(JWTGuard)
  async updateTree(
    @Param('id') _id: string,
    @Body() dto: UpdateTreeDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      const id: TObjectId = new mongoose.Types.ObjectId(_id);
      const userId: TObjectId = new mongoose.Types.ObjectId(session.userId);
      return this.treeSevice.updateTree(dto, userId, id);
    } catch (error) {
      console.log(error);
    }
  }
}
