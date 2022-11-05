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

  async create({ createCrewBoardInput }) {
    const { ...crewBoard } = createCrewBoardInput;
    const dateStandard = crewBoard.date + ' ' + crewBoard.dateTime;
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
