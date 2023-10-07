import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkspaceService {
  create(createWorkspaceDto: any) {
    return 'This action adds a new workspace';
  }

  findAll() {
    return `This action returns all workspace`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update(id: number, updateWorkspaceDto: any) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
