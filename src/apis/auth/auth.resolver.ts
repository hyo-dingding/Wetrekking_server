import {
  CACHE_MANAGER,
  Inject,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/type/context';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService, //
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache, //
  ) {}

  // 로그인
  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    // 1. email이 일치하는 유저를 DB에서 찾기
    const user = await this.userService.findOne({ email });

    // 2. 일치하는 유저가 없으면 에러 던지기
    if (!user)
      throw new UnprocessableEntityException('이메일이 존재하지 않습니다.');

    // 3. 일치하는 유저가 있지만 비밀번호가 틀렸다면?
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');

    // 4. RefreshToken(=JWT)을 만들어서 frontend 브라우저 쿠키에 저장해서 보내주기
    const refreshToken = this.authService.setRefreshToken({
      user,
      req: context.req,
      res: context.res,
    });
    console.log(refreshToken);

    // 4. 일치하는 유저도 있고 비번도 맞았다면?
    // -> accessToken(=> JWT)을 만들어서 브라우저에 전달하기
    return this.authService.getAccessToken({ user });
  }

  // 로그아웃
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(@Context() context: IContext) {
    const accessToken = context.req.headers['authorization'].replace(
      'Bearer ',
      '',
    );
    const refreshToken = context.req.headers['cookie'].replace(
      'refreshToken=',
      '',
    );
    const verifiedAccess = jwt.verify(accessToken, process.env.ACCESSTOKEN_KEY);
    const verifiedRefresh = jwt.verify(
      refreshToken,
      process.env.REFRESHTOKEN_KEY,
    );

    const now = new Date().getTime();
    const accessTokenTtl =
      verifiedAccess['exp'] - Number(String(now).slice(0, -3));
    const refreshTokenTtl =
      verifiedRefresh['exp'] - Number(String(now).slice(0, -3));

    try {
      verifiedAccess;
      await this.cacheManager.set(
        `accessToken:${accessToken}`,
        'accessToken',

        {
          ttl: accessTokenTtl,
        },
      );

      verifiedRefresh;
      await this.cacheManager.set(
        `refreshToken:${refreshToken}`,
        'refreshToken',
        {
          ttl: refreshTokenTtl,
        },
      );
    } catch (error) {
      throw new UnauthorizedException();
    }

    return '로그아웃에 성공하였습니다';
  }

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
