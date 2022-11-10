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

  findAllWithDeleted() {
    return this.crewBoardRepository.find({
      withDeleted: true,
    });
  }

  async findAllDivideNine() {
    const crewBoard = await this.crewBoardRepository.find();
    const newCrewBoard = [];

    this.divideNine(crewBoard, newCrewBoard);
    return newCrewBoard;
  }

  divideNine(array, newArray) {
    while (array.length > 0) {
      newArray.push(array.splice(0, 9));
    }
  }

  cutAlreadyDone(array, today, newArray) {
    array.map((x) =>
      Number(x.dateStandard) > Number(today) ? newArray.push(x) : x,
    );
  }

  changeDateTimeTo24h(dateTimeAMPM) {
    if (
      dateTimeAMPM.split(' ')[1] === 'pm' &&
      dateTimeAMPM.split(' ')[0].split(':')[0] === '12'
    ) {
      return dateTimeAMPM.split(' ')[0];
    }

    if (
      dateTimeAMPM.split(' ')[1] === 'am' &&
      dateTimeAMPM.split(' ')[0].split(':')[0] === '12'
    ) {
      const hour = Number(dateTimeAMPM.split(' ')[0].split(':')[0]) - 12;
      return `${hour}:${dateTimeAMPM.split(' ')[0].split(':')[1]}`;
    }
    const hour =
      dateTimeAMPM.split(' ')[1] === 'pm'
        ? Number(dateTimeAMPM.split(' ')[0].split(':')[0]) + 12
        : String(Number(dateTimeAMPM.split(' ')[0].split(':')[0])).padStart(
            2,
            '0',
          );
    return `${hour}:${dateTimeAMPM.split(' ')[0].split(':')[1]}`;
  }

  // changeDateTimeToAMPM(dateTime24h) {
  //   const AMPM = dateTime24h.split(':')[0] / 12 >= 1 ? 'pm' : 'am';
  //   return (
  //     `${String(Number(dateTime24h.split(':')[0]) % 12).padStart(2, '0')}:` +
  //     `${String(dateTime24h.split(':')[1]).padStart(2, '0')} ${AMPM}`
  //   );
  // }

  async findAllLatestFirst() {
    const newCrewBoard = [];
    const cutAlreadyDone = [];
    const today = new Date();
    const crewBoard = await this.crewBoardRepository.find();

    this.cutAlreadyDone(crewBoard, today, cutAlreadyDone);
    cutAlreadyDone.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    this.divideNine(cutAlreadyDone, newCrewBoard);

    return newCrewBoard;
  }

  async findAllDeadlineFirst() {
    const newCrewBoard = [];
    const cutAlreadyDone = [];
    const today = new Date();
    const crewBoard = await this.crewBoardRepository.find();

    this.cutAlreadyDone(crewBoard, today, cutAlreadyDone);

    cutAlreadyDone.sort(
      (a, b) => Number(a.dateStandard) - Number(b.dateStandard),
    );

    this.divideNine(cutAlreadyDone, newCrewBoard);

    return newCrewBoard;
  }

  async findByDate({ startDate, endDate }) {
    const newCrewBoard = [];
    const cutAlreadyDone = [];
    const pickedDate = [];
    const today = new Date();
    const crewBoard = await this.crewBoardRepository.find();

    this.cutAlreadyDone(crewBoard, today, cutAlreadyDone);

    cutAlreadyDone.map((x) =>
      Date.parse(startDate) <= Date.parse(x.date) &&
      Date.parse(x.date) < Date.parse(endDate) + 86400000
        ? pickedDate.push(x)
        : x,
    );
    pickedDate.sort((a, b) => Number(a.dateStandard) - Number(b.dateStandard));

    this.divideNine(pickedDate, newCrewBoard);

    return newCrewBoard;
  }

  async create({ userId, createCrewBoardInput }) {
    const { ...crewBoard } = createCrewBoardInput;
    const dateTime24h = this.changeDateTimeTo24h(crewBoard.dateTime);
    const dateStandard = crewBoard.date + ' ' + dateTime24h;
    return await this.crewBoardRepository.save({
      ...crewBoard,
      dateStandard: dateStandard,
      userId: userId,
    });
  }

  async createTEST({ createCrewBoardInput }) {
    const { ...crewBoard } = createCrewBoardInput;
    const dateTime24h = this.changeDateTimeTo24h(crewBoard.dateTime);
    const dateStandard = crewBoard.date + ' ' + dateTime24h;
    return await this.crewBoardRepository.save({
      ...crewBoard,
      dateStandard: dateStandard,
    });
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
