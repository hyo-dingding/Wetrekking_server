import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IamportService {
  async getIamportAccessToken() {
    const iamportAccessToken = await axios.post(
      'https://api.iamport.kr/users/getToken',
      {
        headers: { 'Content-Type': 'application/json' },

        imp_key: process.env.IAMPORT_REST_API_KEY,
        imp_secret: process.env.IAMPORT_REST_API_SECRET,
      },
    );

    return iamportAccessToken.data.response.access_token;
  }

  async getPaymentData(impUid, iamportAccessToken) {
    try {
      const paymentData = await axios.get(
        `https://api.iamport.kr/payments/${impUid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${iamportAccessToken}`,
          },
        },
      );
      return paymentData;
    } catch (error) {
      throw new UnprocessableEntityException(
        '위/변조 된 결제: 유효하지않은 impUid입니다..',
      );
    }
  }

  async getPaymentCancelData(imp_uid, amount, iamportAccessToken) {
    await axios({
      url: 'https://api.iamport.kr/payments/cancel',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: iamportAccessToken,
      },
      data: {
        imp_uid,
        amount,
      },
    });
    return [imp_uid, amount];
  }
}
