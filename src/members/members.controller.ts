import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Member } from './entities/member.entity';
import { MemberResponse } from './model/member-response.model';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @ApiOperation({ summary: 'Create a member' })
  @ApiResponse({
    status: 201,
    description: 'Member is created successfully.',
    type: MemberResponse,
  })
  @Post()
  create(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberService.create(createMemberDto);
  }

  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({
    status: 200,
    description: 'Members are returned successfully.',
    type: CreateMemberDto,
  })
  @Get()
  findAll(): Promise<Member[]> {
    return this.memberService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string): Promise<Member> {
    return this.memberService.findOne(code);
  }

  @Patch(':code')
  update(
    @Param('code') code: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    return this.memberService.update(code, updateMemberDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string): Promise<object> {
    return this.memberService.remove(code);
  }
}
