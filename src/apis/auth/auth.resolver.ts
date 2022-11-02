import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/type/context';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { GqlAuthRefreshGuard } from 'src/commons/auth/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService, //
    private readonly authService: AuthService,
  ) {}

  // 로그인
  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    const user = await this.userService.findOne({ email });

    if (!user)
      throw new UnprocessableEntityException('이메일이 존재하지 않습니다.');

    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');

    this.authService.setRefreshToken({ user, res: context.res });

    return this.authService.getAccessToken({ user });
  }

  // async logout

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ) {
    return this.authService.getAccessToken({
      user: context.req.user,
    });
  }
}
