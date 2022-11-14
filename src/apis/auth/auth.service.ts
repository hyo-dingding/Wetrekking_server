import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly userService: UserService,
  ) {}

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.ACCESSTOKEN_KEY, expiresIn: '1h' },
    );
  }

  setRefreshToken({ user, req, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.REFRESHTOKEN_KEY, expiresIn: '2w' },
    );

    const allowedOrigins = [
      'http://localhost:3000',
      'https://develop.wetrekking.kr',
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.wetrekking.kr; SameSite=None; Secure; httpOnly;`,
    );

    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);  // 개발 환경
    return refreshToken;
  }

  async socialLogin({ req, res }) {
    // 1. 회원조회
    const user = await this.userService.findOne({ email: req.user.email });

    // 2. 회원가입이 안되있다면 자동회원가입
    if (!user) {
      const createSocialUserInput = { ...req.user };

      createSocialUserInput.password = await bcrypt.hash(
        createSocialUserInput.password,
        10,
      );
      await this.userService.createSocial({ createSocialUserInput });

      // User.push(createUserInput);
    }
    // console.log(user);

    const aaa = this.setRefreshToken({ user, res, req });
    console.log('!!!!!!!!');
    console.log(aaa);
    // redirect 페이지 이동 다시 내페이지로 다시옴.
    // 추가정보 입력하는 url로 이동하기
    // res.redirect('http://127.0.0.1:5500/src/apis/auth/social.html');
    res.redirect('http://localhost:3000/social');

    //  소셜로그인 완료 후 Redirect 되면 nickname, phone, gender 입력하게 하기
  }
}
