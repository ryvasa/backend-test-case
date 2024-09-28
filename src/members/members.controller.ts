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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Member } from './entities/member.entity';
import {
  CreateMemberDto,
  MemberActiveLoanResponseDto,
  MemberLoanResponseDto,
  MemberMessageResponseDto,
  MemberResponseDto,
  UpdateMemberDto,
} from './dto';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @ApiOperation({ summary: 'Create a member' })
  @ApiResponse({
    status: 201,
    description: 'Member is created successfully.',
    type: MemberResponseDto,
  })
  @Post()
  createMember(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberService.createMember(createMemberDto);
  }

  @ApiOperation({
    summary: 'Get all members with active borrowed book (Member check)',
  })
  @ApiResponse({
    status: 200,
    description: 'Members are returned successfully.',
    type: MemberActiveLoanResponseDto,
  })
  @Get()
  findAllMember(): Promise<Member[]> {
    return this.memberService.findAllMember();
  }

  @ApiOperation({
    summary: 'Get all members with all book loans history (Member check)',
  })
  @ApiResponse({
    status: 200,
    description: 'Members are returned successfully.',
    type: MemberLoanResponseDto,
  })
  @Get('loans')
  findAllMemberHistoryLoan(): Promise<Member[]> {
    return this.memberService.findAllMemberHistoryLoan();
  }

  @ApiOperation({ summary: 'Get a member' })
  @ApiResponse({
    status: 200,
    description: 'Member is returned successfully.',
    type: MemberResponseDto,
  })
  @Get(':code')
  findOneMember(@Param('code') code: string): Promise<Member> {
    return this.memberService.findOneMember(code);
  }

  @ApiOperation({ summary: 'Update a member' })
  @ApiResponse({
    status: 200,
    description: 'Member is updated successfully.',
    type: MemberResponseDto,
  })
  @Patch(':code')
  updateMember(
    @Param('code') code: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    return this.memberService.updateMember(code, updateMemberDto);
  }

  @ApiOperation({ summary: 'Delete a member' })
  @ApiResponse({
    status: 200,
    description: 'Member is deleted successfully.',
    type: MemberMessageResponseDto,
  })
  @Delete(':code')
  deleteMember(@Param('code') code: string): Promise<object> {
    return this.memberService.deleteMember(code);
  }
}
