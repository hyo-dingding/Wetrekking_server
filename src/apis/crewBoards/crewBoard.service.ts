import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrewBoard } from './entities/crewBoard.entity';

@Injectable()
export class CrewBoardService {
  constructor(
    @InjectRepository(CrewBoard)
    private readonly crewBoardRepository: Repository<CrewBoard>, //
  ) {}

  findOneById({ crewBoardId }) {
    return this.crewBoardRepository.findOne({
      where: { id: crewBoardId },
    });
  }

  findAll() {
    return this.crewBoardRepository.find();
  }

  async findAllDivideNine() {
    const crewBoard = await this.crewBoardRepository.find();
    const newCrewBoard = [];
    console.log(crewBoard);
    while (crewBoard.length > 0) {
      newCrewBoard.push(crewBoard.splice(0, 9));
    }
    return newCrewBoard;
  }

  async findAllNew() {
    const newCrewBoard = [];
    const cutAlreadyDone = [];
    const today = new Date();
    const crewBoard = await this.crewBoardRepository.find();

    crewBoard.map((x) =>
      Number(x.date) > Number(today) ? cutAlreadyDone.push(x) : x,
    );
    cutAlreadyDone.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

    while (cutAlreadyDone.length > 0) {
      newCrewBoard.push(cutAlreadyDone.splice(0, 9));
    }

    return newCrewBoard;
  }

  // findAllValid() {
  // 현재 시간을 여기에 해야하나?
  // 일단 여기에 하고 나중에 옮기자
  // const today = new Date();
  // const todayYear = today.getFullYear();
  // const todayMonth = today.getMonth() + 1;
  // const todayDate = today.getDate();
  // // const day = today.getDay();
  // const date = `${todayYear}-${todayMonth}-${todayDate}`;

  // const newToday = today.toString().split(' ')[4].split(':');
  // const dateTime = `${newToday[0]}:${newToday[1]}`;

  //   const today = new Date();

  //   return this.crewBoardRepository.find();
  // }

  // async findByDate({ startDate, endDate }) {
  //   // startDate = startDate.split('-');
  //   // endDate = endDate.split('-');
  //   console.log(new Date(2022, 10, 10));
  //   const a = await this.crewBoardRepository.find({
  //     where: {
  //       // date: Between(
  //       //   new Date(
  //       //     Number(endDate[0]),
  //       //     Number(endDate[1] - 1),
  //       //     Number(endDate[2] + 1 ),
  //       //   ),
  //       //   new Date(
  //       //     Number(startDate[0]),
  //       //     Number(startDate[1] - 1),
  //       //     Number(startDate[2] + 1),
  //       //   ),
  //       // ),
  //       // date: new Date(2022, 11)
  //       date: '2022-11-09',
  //     },
  //   });
  //   // console.log(a);
  //   return a;
  // }

  findAllWithDelete() {
    return this.crewBoardRepository.find({
      withDeleted: true,
    });
  }

  create({ createCrewBoardInput }) {
    const { ...crewBoard } = createCrewBoardInput;
    return this.crewBoardRepository.save({ ...crewBoard });
  }

  async update({ crewBoardId, updateCrewBoardInput }) {
    const crewBoard = await this.crewBoardRepository.findOne({
      where: { id: crewBoardId },
    });
    return this.crewBoardRepository.save({
      ...crewBoard,
      id: crewBoardId,
      ...updateCrewBoardInput,
    });
  }

  async delete({ crewBoardId }) {
    const result = await this.crewBoardRepository.softDelete({
      id: crewBoardId,
    });
    return result.affected ? true : false;
  }
}
