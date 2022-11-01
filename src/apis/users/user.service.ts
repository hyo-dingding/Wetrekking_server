import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, //
  ) {}

  async create({ createUserInput }) {
    // const { email, nickname, profile_img, ...user } = createUserInput;

    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    const result = await this.userRepository.save({
      ...createUserInput,
      password: hashedPassword,
    });

    return result;
  }
}
