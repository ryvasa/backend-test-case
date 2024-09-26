import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../entities/member.entity';

export class MemberResponse {
  @ApiProperty({ type: Member })
  data: Member;
}

export class ArrayMemberResponse {
  @ApiProperty({ type: Array })
  data: Member[];
}

export class MemberMessage {
  @ApiProperty({ type: String, example: 'Member has been deleted' })
  message: string;
}

export class MemberMessageResponse {
  @ApiProperty({ type: MemberMessage })
  data: MemberMessage;
}
