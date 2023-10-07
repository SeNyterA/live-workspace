import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelService {
  create(createTeamDto: any) {
    return 'This action adds a new team';
  }

  findAll() {
    return `This action returns all team`;
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: any) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
