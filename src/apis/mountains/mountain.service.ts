import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MountainService {
  async findMountain(mountain) {
    const mountainInfo = await axios({
      url: 'http://apis.data.go.kr/1400000/service/cultureInfoService/mntInfoOpenAPI',
      method: 'GET',
      params: {
        ServiceKey:
          'aNXB1+3YRqxOxUCPE6Adxuaqb/ELwQ1hN/cJEtCrdiOwP2NVnyBfcQxtp8NmE8muyxDMha4fc67TCY0k//1skA==',
        searchWrd: `${mountain}`,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((err) => {
      throw err;
    });
    console.log(mountainInfo.data.response.body.items.item);
    const result = mountainInfo.data.response.body.items.item;
    return result;
  }
}
