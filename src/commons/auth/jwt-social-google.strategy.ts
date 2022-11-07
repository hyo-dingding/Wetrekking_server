import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }
  validate(accessToken, refreshToken, profile) {
    console.log(accessToken);
    console.log(refreshToken); // 안나옴
    console.log(profile);

    return {
      // req.user ={값이 이안에 들어감} 리턴된 값 넣어주기
      email: profile.emails[0].value,
      password: profile.id,
      name: profile.displayName,
      // 아래는 google에서 제공해주는 값이 아님
      // nickname: '딩딩',
      // phone: '01022223333',
      // gender: '여',
    };
  }
}
