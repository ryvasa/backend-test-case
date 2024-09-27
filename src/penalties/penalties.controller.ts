import { Controller, Get, Param } from '@nestjs/common';
import { PenaltiesService } from './penalties.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Penalty } from './entities/penalty.entity';

@ApiTags('Penalty')
@Controller('penalties')
export class PenaltiesController {
  constructor(private readonly penaltiesService: PenaltiesService) {}

  @ApiOperation({ summary: 'Find all penalties' })
  @ApiResponse({ status: 200, description: 'Found penalties' })
  @Get()
  findAll(): Promise<Penalty[]> {
    return this.penaltiesService.findAllPenalty();
  }

  @ApiOperation({ summary: 'Find a penalty by member code' })
  @ApiResponse({ status: 200, description: 'Found penalty' })
  @Get(':member_code')
  findOne(@Param('member_code') member_code: string): Promise<Penalty> {
    return this.penaltiesService.findOnePenaltyByMember(member_code);
  }
}
