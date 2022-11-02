import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    // private readonly cacheManager: Cache, // @Inject(CACHE_MANAGER)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //
      secretOrKey: process.env.ACCESSTOKEN_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    console.log('payload: ', payload);

    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
