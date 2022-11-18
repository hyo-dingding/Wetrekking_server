import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as fs from 'fs';
import {
  TrekkingInfo,
  TrekkingInfoDocument,
} from './schemas/trekkingInfo.schema';

@Injectable()
export class TrekkingService {
  constructor(
    @InjectModel(TrekkingInfo.name)
    private readonly trekkingInfoModel: mongoose.Model<TrekkingInfoDocument>, //
  ) {}

  // 읍면동 코드 API
  // async getEmdCdInfo({ address }) {
  //   const emdCdInfo = await axios({
  //     url: 'http://api.vworld.kr/req/data',
  //     method: 'GET',
  //     params: {
  //       key: '21C35C47-E16F-3811-A71E-F3E339A7D1AE',
  //       attrFilter: `full_nm:=:${address}`,
  //       data: 'LT_C_ADEMD_INFO',
  //       request: 'GetFeature',
  //       domain: 'localhost:3000',
  //     },
  //     headers: {
  //       'Content-type': 'application/json',
  //     },
  //   }).catch((err) => {
  //     throw err;
  //   });

  //   const emdCd =
  //     emdCdInfo.data.response.result.featureCollection.features[0].properties
  //       .emd_cd;
  //   // console.log(emdCd);
  //   return emdCd;
  // }

  // // 등산로 API
  // async getTrekkingInfo({ qqq, mountainName }) {
  //   const www = [];
  //   const getTrekkingInfo = await axios({
  //     url: 'http://api.vworld.kr/req/data',
  //     method: 'GET',
  //     params: {
  //       key: '21C35C47-E16F-3811-A71E-F3E339A7D1AE',
  //       attrFilter: `mntn_nm:=:${mountainName}|emdCd:=:${qqq}`,
  //       crs: 'EPSG:4326',
  //       data: 'LT_L_FRSTCLIMB',
  //       domain: 'localhost:3000',
  //       request: 'GetFeature',
  //     },
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   }).catch((err) => {
  //     throw err;
  //   });

  //   const aaa = getTrekkingInfo.data.response.result.featureCollection.features;
  //   for (let i = 0; i < aaa.length; i++) {
  //     // console.log(aaa[i].geometry.coordinates);
  //     const data = aaa[i].geometry.coordinates[0];
  //     console.log('before', data);
  //     for (let j = 0; j < data.length; j++) {
  //       const temp = data[j][1];
  //       data[j][1] = data[j][0];
  //       data[j][0] = temp;
  //     }
  //     console.log('after', data);
  //     www.push(data);
  //   }
  //   const zzz = {
  //     mountainName,
  //     xyz: www.flat(),
  //   };
  //   // console.log(zzz);

  //   return zzz;
  // }

  async findTrekking({ mountainName }) {
    const findAll = await this.trekkingInfoModel.find({ mountainName });

    // for (let i = 0; i < findAll.length - 1; i++) {
    //   for (let j = i + 1; j < findAll.length; j++) {
    //     if (findAll[i].trekkingName === findAll[j].trekkingName) {
    //       findAll[i].coordinate.concat(findAll[j].coordinate);
    //     }
    //   }
    // }
    return findAll;
  }

  async saveTrekking() {
    const file = fs.readFileSync('./src/apis/trekking/13qq.geojson');

    const result = file.toString();
    const aaa = JSON.parse(JSON.stringify(result));
    const bbb = JSON.parse(aaa);
    const ccc = bbb.features;
    let result123;

    for (let i = 0; i < ccc.length; i++) {
      const a = ccc[i].geometry.coordinates.flat();
      result123 = await this.trekkingInfoModel.create({
        mountainName: ccc[i].properties['MNTN_NM'],
        trekkingName: ccc[i].properties['PMNTN_NM'],
        difficulty: ccc[i].properties['PMNTN_DFFL'],
        coordinate: a.map((el) => el.reverse()),
      });
    }

    return result123;
  }
}
