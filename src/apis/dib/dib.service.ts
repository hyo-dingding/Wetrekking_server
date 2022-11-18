import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrewBoardService } from '../crewBoards/crewBoard.service';
import { CrewBoardAndUser } from '../crewBoards/dto/crewBoardAndUser.output';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';
import { CrewUserList } from '../crewUserList/entities/crewUserList.entity';
import { DibsWithCrewBoard } from './dto/dibsWithCrewBoard.output';
import { Dib } from './entities/dib.entity';

@Injectable()
export class DibService {
  constructor(
    @InjectRepository(Dib)
    private readonly dibRepository: Repository<Dib>, //
    @InjectRepository(CrewBoard)
    private readonly crewBoardRepository: Repository<CrewBoard>,
    @InjectRepository(CrewUserList)
    private readonly crewUserListRepository: Repository<CrewUserList>,
    private readonly crewBoardService: CrewBoardService,
  ) {}

  async findAll({ userId }) {
    // 현재 유저가 찜한 모든 목록 조회
    const dibs = await this.dibRepository
      .createQueryBuilder('dib')
      .leftJoinAndSelect('dib.user', 'user')
      .leftJoinAndSelect('dib.crewBoard', 'crewBoard')
      .where('user.id = :userId', { userId })
      .getMany();

    const crewBoards = [];
    await Promise.all(
      dibs.map(async (dib) => {
        crewBoards.push(
          await this.crewBoardRepository
            .createQueryBuilder('crewBoard')
            .leftJoinAndSelect('crewBoard.mountain', 'mountain')
            .leftJoinAndSelect('crewBoard.user', 'user')
            .where('crewBoard.id = :crewBoardId', {
              crewBoardId: dib.crewBoard.id,
            })
            .getMany(),
        );
      }),
    );

    const data: CrewBoardAndUser[] = await Promise.all(
      crewBoards.flat().map(async (crewBoard) => {
        const filteredList = await this.crewUserListRepository
          .createQueryBuilder('crewUserList')
          .leftJoinAndSelect('crewUserList.crewBoard', 'crewBoard')
          .leftJoinAndSelect('crewUserList.user', 'user')
          .where('crewBoard.id = :crewBoardId', {
            crewBoardId: crewBoard.id,
          })
          .andWhere('crewUserList.status = "수락"')
          .getMany();

        const assignedUsers = [];
        filteredList.map((el) => {
          // console.log(el.user);
          assignedUsers.push(el.user);
        });

        const filteredDib = await this.dibRepository
          .createQueryBuilder('dib')
          .leftJoinAndSelect('dib.user', 'user')
          .leftJoinAndSelect('dib.crewBoard', 'crewBoard')
          .where('crewBoard.id = :crewBoardId', { crewBoardId: crewBoard.id })
          .getMany();

        const dibUsers = [];
        filteredDib.map((el) => {
          dibUsers.push(el.user);
        });

        console.log(dibUsers);
        return {
          ...crewBoard,
          assignedUsers,
          dibUsers,
        };
      }),
    );

    const result = [];
    dibs.map((dib, idx) => {
      result.push({
        id: dib.id,
        user: dib.user,
        crewBoard: { ...data[idx] },
      });
    });
    return result;
  }

  async findOne({ userId, crewBoardId }) {
    return await this.dibRepository.findOne({
      where: {
        crewBoard: { id: crewBoardId }, //
        user: { id: userId },
      },
      relations: ['crewBoard', 'user', 'crewBoard.user'],
    });
  }

  create({ userId, crewBoardId }) {
    return this.dibRepository.save({
      user: userId,
      crewBoard: crewBoardId,
    });
  }

  async delete({ crewBoardId }) {
    return await this.dibRepository.delete({
      crewBoard: crewBoardId,
    });
  }
}
