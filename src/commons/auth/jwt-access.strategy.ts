import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //
      sercretOrKey: process.env.ACCESSTOKEN_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    console.log('payload: ', payload);

    const replaceAccess = req.headers.authorization.replace('Bearer  ', '');
  }
}
