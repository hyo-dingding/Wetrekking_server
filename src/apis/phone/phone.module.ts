import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { PhoneResolver } from './phone.resolver';
import { PhoneService } from './phone.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    PhoneResolver, //
    PhoneService,
    UserService,
  ],
})
export class PhoneModule {}
