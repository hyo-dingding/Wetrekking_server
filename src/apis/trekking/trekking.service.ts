import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as fs from 'fs';
import {
  TrekkingInfo,
  TrekkingInfoDocument,
} from './schemas/trekkingInfo.schema';
import axios from 'axios';

@Injectable()
export class TrekkingService {
  constructor(
    @InjectModel(TrekkingInfo.name)
    private readonly trekkingInfoModel: mongoose.Model<TrekkingInfoDocument>, //
  ) {}

  // 읍면동 코드 API
  async getEmdCdInfo({ address }) {
    const emdCdInfo = await axios({
      url: 'http://api.vworld.kr/req/data',
      method: 'GET',
      params: {
        key: '21C35C47-E16F-3811-A71E-F3E339A7D1AE',
        attrFilter: `full_nm:=:${address}`,
        data: 'LT_C_ADEMD_INFO',
        request: 'GetFeature',
        domain: 'https://develop.wetrekking.kr',
      },
      headers: {
        'Content-type': 'application/json',
      },
    }).catch((err) => {
      throw err;
    });

    const emdCd =
      emdCdInfo.data.response.result.featureCollection.features[0].properties
        .emd_cd;
    // console.log(emdCd);
    return emdCd;
  }

  // 등산로 API
  async getTrekkingInfo({ addressEmdCd, mountainName }) {
    const arr = [];
    const getTrekkingInfo = await axios({
      url: 'http://api.vworld.kr/req/data',
      method: 'GET',
      params: {
        key: '21C35C47-E16F-3811-A71E-F3E339A7D1AE',
        attrFilter: `mntn_nm:=:${mountainName}|emdCd:=:${addressEmdCd}`,
        crs: 'EPSG:4326',
        data: 'LT_L_FRSTCLIMB',
        domain: 'https://develop.wetrekking.kr',
        request: 'GetFeature',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((err) => {
      throw err;
    });

    const wetrekking =
      getTrekkingInfo.data.response.result.featureCollection.features;

    for (let i = 0; i < wetrekking.length; i++) {
      const data = wetrekking[i].geometry.coordinates[0];

      for (let j = 0; j < data.length; j++) {
        const temp = data[j][1];
        data[j][1] = data[j][0];
        data[j][0] = temp;
      }

      arr.push(data);
    }
    const result = {
      mountainName,
      coordinate: arr.flat(),
    };
    // console.log(zzz);

    return result;
  }

  async findTrekking({ mountainName }) {
    const findAll = await this.trekkingInfoModel.find({ mountainName });

    console.log(findAll);

    return findAll;
  }

  // async saveTrekking() {
  //   const file = fs.readFileSync('./src/apis/trekking/13qq.geojson');

  //   const result = file.toString();
  //   const aaa = JSON.parse(JSON.stringify(result));
  //   const bbb = JSON.parse(aaa);
  //   const ccc = bbb.features;
  //   let result123;

  //   for (let i = 0; i < 1; i++) {
  //     const a = ccc[i].geometry.coordinates.flat();
  //     result123 = await this.trekkingInfoModel.create({
  //       mountainName: ccc[i].properties['MNTN_NM'],
  //       trekkingName: ccc[i].poperties['PMNTN_NM'],
  //       difficulty: ccc[i].properties['PMNTN_DFFL'],
  //       coordinate: a.map((el) => el.reverse()),
  //     });
  //   }

  //   return '성공';
  // }
}
