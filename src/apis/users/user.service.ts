import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, //
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  // email, nickname check 확인을 위해 변수로 등록함.
  findOne(type) {
    return this.userRepository.findOne({
      where: type,
    });
  }

  async create({ createUserInput }) {
    // const { nickname, profile_img, ...user } = createUserInput;
    const { ...user } = createUserInput;

    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    const result = await this.userRepository.save({
      // ...createUserInput,
      ...user,
      password: hashedPassword,
    });

    return result;
  }

  createSocail({ createSocialUserInput }) {
    const { ...user } = createSocialUserInput;
    return this.userRepository.save({ ...user });
  }

  async update({ userId, updateUserInput }) {
    const origin = await this.userRepository.findOne({
      where: { id: userId },
    });
    const hashedPassword = await bcrypt.hash(updateUserInput.password, 10);

    const result = this.userRepository.save({
      ...origin,
      id: userId,
      ...updateUserInput,
      password: hashedPassword,
    });
    console.log(result);

    return result;
  }

  async delete({ userId }) {
    const result = await this.userRepository.softDelete({ id: userId });
    return result.affected ? true : false;
  }

  async restore({ userId }) {
    const result = await this.userRepository.restore({ id: userId });
    return result.affected ? true : false;
  }
}
