import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PenaltiesService } from './penalties.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Penalty } from './entities/penalty.entity';
import {
  PenaltyJoinResponseDto,
  PenaltiesResponseDto,
  AddPenaltyResponseDto,
} from './dto/response-penalty.dto';
import { CreatePenaltyDto } from './dto';

@ApiTags('Penalty')
@Controller('penalties')
export class PenaltiesController {
  constructor(private readonly penaltiesService: PenaltiesService) {}

  @ApiOperation({ summary: 'Create a penalty' })
  @ApiResponse({
    status: 201,
    description: 'Created penalty',
    type: AddPenaltyResponseDto,
  })
  @Post()
  create(@Body() createPenaltyDto: CreatePenaltyDto): Promise<Penalty> {
    return this.penaltiesService.createPenalty(createPenaltyDto);
  }

  @ApiOperation({ summary: 'Find all penalties' })
  @ApiResponse({
    status: 200,
    description: 'Found penalties',
    type: PenaltiesResponseDto,
  })
  @Get()
  findAll(): Promise<Penalty[]> {
    return this.penaltiesService.findAllPenalty();
  }

  @ApiOperation({ summary: 'Find a penalty by member code' })
  @ApiResponse({
    status: 200,
    description: 'Found penalty',
    type: PenaltyJoinResponseDto,
  })
  @Get(':member_code')
  findPenlatiesByMember(
    @Param('member_code') member_code: string,
  ): Promise<Penalty[]> {
    return this.penaltiesService.findPenaltiesByMember(member_code);
  }
}
