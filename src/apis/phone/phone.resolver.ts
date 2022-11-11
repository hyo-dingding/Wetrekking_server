import { Inject, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../users/user.service';
import { PhoneService } from './phone.service';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Resolver()
export class PhoneResolver {
  constructor(
    private readonly phoneService: PhoneService, //
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async sendTokenToPhone(
    @Args('phone') phone: string, //
  ) {
    try {
      // 핸드폰 유효성 검사
      this.phoneService.checkPhoneLength({ phone });
      // 토큰생성하기
      const phoneToken = this.phoneService.createToken();

      // 핸드폰 sms 보내기
      // const smsToken = this.phoneService.sendToTokenPhone({
      //   phone,
      //   phoneToken,
      // });
      await this.cacheManager.set(phone, phoneToken, { ttl: 800 });
      this.cacheManager.get(phone).then((res) => console.log(res));

      return `${phoneToken}`;
    } catch (error) {
      // user에 이미 핸드폰번호가 등록되있으면 에러 띄우기
      const checkUserPhone = this.userService.findOne({ phone });
      if (checkUserPhone) {
        throw new NotFoundException('이미 등록된 핸드폰번호입니다.');
      }
    }
  }

  @Mutation(() => String)
  async checkTokenPhone(
    @Args('phone') phone: string, //
    @Args('phoneToken') phoneToken: string,
  ) {
    try {
      const cachePhoneToken = await this.cacheManager.get(phone);
      if (cachePhoneToken === phoneToken) {
        return '인증완료 되었습니다.';
      }

      // User가 입력한 token 과 cache에 저장한 token이 같으면  cache에  해당 phone 에 true 저장
      await this.cacheManager.set(phone, true, {
        ttl: 800,
      });

      this.cacheManager.get(phone).then((res) => console.log(res));
    } catch (error) {
      // 토큰확인 하기
      const cachePhoneToken = await this.cacheManager.get(phone);
      if (cachePhoneToken !== phoneToken) {
        throw new Error('인증번호가 일치하지 않습니다.');
      }
    }
  }
}
// 토큰 레디스에 저장하고 그거랑 입력한 인증번호랑 비교해서 검증
