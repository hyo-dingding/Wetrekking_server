import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from '../users/dto/createUser.input';
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

  setRefreshToken({ user, res, req }) {
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
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    return refreshToken;
  }

  async socialLogin({ req, res }) {
    // 1. 회원조회
    const user = await this.userService.findOne({ email: req.user.email });

    // 2. 회원가입이 안되있다면 자동회원가입
    if (!user) {
      const createUserInput = { ...req.user };

      createUserInput.password = await bcrypt.hash(
        createUserInput.password,
        10,
      );
      await this.userService.create({ createUserInput });

      // User.push(createUserInput);
    }
    // console.log(user);
    // this.setRefreshToken({ user, res, req });
    // console.log(user);
    //redirect 페이지 이동 다시 내페이지로 다시옴.
    res.redirect('http://127.0.0.1:5500/frentend.html');

    //  소셜로그인 완료 후 Redirect 되면 nickname, phone, gender 입력하게 하기
  }
}
