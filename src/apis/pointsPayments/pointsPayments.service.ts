import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { PointPayment } from './entities/pointPayment.entity';

@Injectable()
export class PointPaymentService {
  constructor(
    @InjectRepository(PointPayment)
    private readonly pointPaymentRepository: Repository<PointPayment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  findById({ userId }) {
    return this.pointPaymentRepository.findOne({
      where: { id: userId },
      relations: ['user'],
    });
  }

  findAllbyId({ userId }) {
    return this.pointPaymentRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  findAll() {
    this.pointPaymentRepository.find();
  }

  async create({ impUid, amount, _user, status }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // 1. transaction 시작
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // 1-1. 결제 테이블에 저장할 내용 담는 공간 할당 후 내용 기입
      const pointPayment = this.pointPaymentRepository.create({
        impUid: impUid,
        amount: amount,
        user: _user,
        status,
      });
      // 1-2. 결제 테이블에 저장
      await queryRunner.manager.save(pointPayment);

      // 1-3. 충전한 유저 정보 가져오기 (DB 잠금)
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      // 1-4. User에 충전 금액 추가
      await queryRunner.manager.update(
        User,
        { id: _user.id },
        { point: user.point + amount },
      );

      // 2. commit 성공 확정
      await queryRunner.commitTransaction();

      return pointPayment;
    } catch (error) {
      // 3. rollback
      await queryRunner.rollbackTransaction();
    } finally {
      // 4. 연결 해제
      await queryRunner.release();
    }
  }

  findImpUid() {
    return this.pointPaymentRepository.find();
  }

  async findPaymentData({ imp_uid }) {
    return await this.pointPaymentRepository.findOne({
      where: {
        impUid: imp_uid,
        status: 'PAYMENT',
      },
    });
  }

  async findPaymentCancelData({ imp_uid }) {
    return await this.pointPaymentRepository.findOne({
      where: {
        impUid: imp_uid,
        status: 'CANCEL',
      },
    });
  }
}
