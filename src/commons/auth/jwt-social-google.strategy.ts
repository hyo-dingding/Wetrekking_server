import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

// const random = String(Math.floor(Math.random() * 100000000)).padStart(6, '0');
// const randomPhoneNumber = `010${random}`;

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
      email: profile.email,
      password: profile.id,
      name: profile.displayName,

      // 임의로 입력하고 로그인 후 수정하게 하기
      nickname: '',
      phone: '',
      gender: '',
      birth: '',
    };
  }
}
