import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtAppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://34.64.102.157:3000/login/google',
      scope: ['email', 'profile'],
    });
  }
  validate(accessToken, refreshToken, profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    return {
      // req.user ={값이 이안에 들어감} 리턴된 값 넣어주기
      email: profile.emails[0].value,
      password: profile.emails[0].value,
      name: profile.displayName,
    };
  }
}
