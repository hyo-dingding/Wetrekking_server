import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
  ) {}

  @Query(() => User)
  fetchUser(@Args('email') email: string) {
    return this.userService.findOne({ email });
  }

  @Query(() => User)
  async fetchCheckEmail(@Args('email') email: string) {
    const findEmail = await this.userService.findOne({ email });
    if (findEmail) {
      throw new Error('이미 등록된 이메일 입니다');
    }
    return findEmail;
  }

  @Query(() => User)
  async fetchCheckNickName(@Args('nickname') nickname: string) {
    const findNickName = await this.userService.findOne({ nickname });
    if (findNickName) {
      throw new Error('이미 등록된 닉네임 입니다');
    }
    return findNickName;
  }

  // 회원가입
  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    return this.userService.create({
      createUserInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  updateUser(
    @Args('userId') userId: string, //
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.update({ userId, updateUserInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(
    @Args('userId') userId: string, //
  ) {
    return this.userService.delete({ userId });
  }
}
