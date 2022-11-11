import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: [
        'profile_nickname',
        'profile_image',
        'account_email',
        'gender',
        'age_range',
        'birthday',
      ],
    });
  }
  validate(accessToken, refreshToken, profile) {
    const profileJson = profile._json;
    console.log(accessToken);
    console.log(refreshToken);

    const kakao_account = profileJson.kakao_account;
    console.log(kakao_account);
    console.log(profile);
    return {
      // req.user ={값이 이안에 들어감} 리턴된 값 넣어주기
      email: profile.email,
      password: kakao_account.email,
      name: profile.displayName,
      nickname: profile.username,
      phone: '',
      gender: kakao_account.gender,
      birth: '',
    };
  }
}
