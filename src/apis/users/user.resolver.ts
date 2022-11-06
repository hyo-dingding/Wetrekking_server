import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { Cache } from 'cache-manager';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Query(() => User)
  fetchUser(@Args('email') email: string) {
    return this.userService.findOne({ email });
  }

  // @Query(() => User)
  // fetchUsers(@Args('page', { defaultValue: 1 }) page: number) {
  //   return this.userService.findAll({ page });
  // }

  // 이메일 중복 검증
  @Query(() => String)
  async fetchCheckEmail(@Args('email') email: string) {
    const findEmail = await this.userService.findOne({ email });
    if (findEmail) {
      throw new Error('이미 등록된 이메일 입니다');
    }
    return '사용가능한 이메일입니다.';
  }

  // 닉네임 중복 검증
  @Query(() => String)
  async fetchCheckNickName(@Args('nickname') nickname: string) {
    const findNickName = await this.userService.findOne({ nickname });
    if (findNickName) {
      throw new Error('이미 등록된 닉네임 입니다');
    }
    return '사용가능한 이메일입니다.';
  }

  // 회원가입
  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    const checkTokenTrue = await this.cacheManager.get(createUserInput.phone);
    if (!checkTokenTrue) {
      throw new Error('휴대폰 인증이 올바르지 않습니다.');
    }

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
    // email로 삭제 할지
    @Args('userId') userId: string, //
  ) {
    return this.userService.delete({ userId });
  }
}
