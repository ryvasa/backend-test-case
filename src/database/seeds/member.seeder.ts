import { Member } from 'src/members/entities/member.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class MemberSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const memberRepository = dataSource.getRepository(Member);

    const members = [
      {
        code: 'M001',
        name: 'Angga',
      },
      {
        code: 'M002',
        name: 'Ferry',
      },
      {
        code: 'M003',
        name: 'Putri',
      },
    ];

    for (const memberData of members) {
      const member = new Member();
      Object.assign(member, memberData);
      await memberRepository.save(member);
    }
  }
}
