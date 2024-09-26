import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import { RefuelingService } from './refueling.service';
import { Refueling } from './entities/refueling.entity';
import { CreateRefuelingDto } from './dto/create-refueling.dto';
import { Query } from '@nestjs/common';
import { QueryParamsDto } from './dto/query-params.dto';

@ApiTags('Refuelings')
@Controller()
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class RefuelingController {
  constructor(private readonly refuelingService: RefuelingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new refueling' })
  @ApiResponse({
    status: 201,
    description: 'The refueling has been successfully created.',
    type: Refueling,
  })
  create(@Body() createRefuelingDto: CreateRefuelingDto) {
    return this.refuelingService.create(createRefuelingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all refuelings' })
  @ApiResponse({
    status: 200,
    description: 'Return all refuelings.',
    type: [Refueling],
  })
  findAll(@Query() params: QueryParamsDto) {
    return this.refuelingService.findAll(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a refueling by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the refueling.',
    type: Refueling,
  })
  findOne(@Param('id') id: string) {
    return this.refuelingService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a refueling' })
  @ApiResponse({
    status: 200,
    description: 'The refueling has been successfully updated.',
    type: Refueling,
  })
  update(
    @Param('id') id: string,
    @Body() updateRefuelingDto: CreateRefuelingDto,
  ) {
    return this.refuelingService.update(+id, updateRefuelingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a refueling' })
  @ApiResponse({
    status: 200,
    description: 'The refueling has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.refuelingService.remove(+id);
  }
}
