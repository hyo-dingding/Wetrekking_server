import {
  ConflictException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { IamportService } from '../iamport/iamport.service';
import {
  PointPayment,
  POINT_PAYMENT_STATUS_ENUM,
} from './entities/pointPayment.entity';
import { PointPaymentService } from './pointsPayments.service';

@Resolver()
export class PointPaymentResolver {
  constructor(
    private readonly pointPaymentService: PointPaymentService,
    private readonly iamportService: IamportService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => PointPayment)
  async createPointPayment(
    @Args('impUid') impUid: string,
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Context() context: IContext,
  ) {
    console.log('user 정보', context.req.user);
    const _user = context.req.user;

    // 1. accessToken 받아오기
    const iamportAccessToken =
      await this.iamportService.getIamportAccessToken();
    console.log('!!!!!!!!!!!!', iamportAccessToken);
    // 2. accessToken 사용하여 조회
    const paymentData = await this.iamportService.getPaymentData(
      impUid,
      iamportAccessToken,
    );
    console.log('@@@@@@@@@@', paymentData);
    // 3. 결제 금액/아이디 조회
    const { imp_uid } = paymentData.data.response;
    const amountToBePaid = amount;
    const amountPaid = paymentData.data.response.amount;

    // 4. 결제 내역 있는지 확인
    const isAlreadyPayment = await this.pointPaymentService.findPaymentData({
      imp_uid,
    });
    console.log('############', isAlreadyPayment);

    // 5. 결제 내역이 이미 있는경우 오류문구 반환
    if (isAlreadyPayment) {
      throw new ConflictException('이미 결제가 완료되었습니다.');
    }

    // 6. 결제 내역이 없는경우 결제 정보 검증
    if (amountPaid === amountToBePaid) {
      // 6-1. 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
      return this.pointPaymentService.create({
        impUid,
        amount,
        _user,
        status: POINT_PAYMENT_STATUS_ENUM.PAYMENT,
      });
    } else {
      // 6-2. 결제금액 불일치. 위/변조 된 결제
      throw new UnprocessableEntityException(
        '위/변조 된 결제: 결제 금액이 일치하지 않습니다.',
      );
    }
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => PointPayment)
  async cancelPointPayment(
    @Args('impUid') impUid: string,
    @Context() context: IContext,
  ) {
    console.log('user 정보', context.req.user);
    const _user = context.req.user;

    // 1. accessToken 받아오기
    const iamportAccessToken =
      await this.iamportService.getIamportAccessToken();

    // 2. accessToken 사용하여 결제 내역 조회
    const paymentData = await this.iamportService.getPaymentData(
      impUid,
      iamportAccessToken,
    );

    // 3. 결제 아이디/결제금액 조회
    const { imp_uid, amount } = paymentData.data.response;

    // 4. 결제 아이디로 결제내역 조회
    const fetchPointPayment =
      await this.pointPaymentService.findPaymentCancelData({
        imp_uid,
      });

    // 5. 결제 상태가 CANCLE이 아니면 취소 요청
    if (!fetchPointPayment) {
      const cancelData = await this.iamportService.getPaymentCancelData(
        imp_uid,
        amount,
        iamportAccessToken,
      );
      // 5-1. 취소데이터 받아오기
      const canceledImpUid = cancelData[0];
      const canceledAmount = -cancelData[1];

      // 5-2. DB 저장
      return this.pointPaymentService.create({
        impUid: canceledImpUid,
        amount: canceledAmount,
        _user,
        status: POINT_PAYMENT_STATUS_ENUM.CANCEL,
      });
    }

    // 6. 결제 상태가 CANCLE이면 오류문구
    else {
      throw new UnprocessableEntityException('이미 취소된 결제입니다.');
    }
  }
}
