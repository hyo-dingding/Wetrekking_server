import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  async upload({ file }) {
    const waitedImages = await Promise.all(file);

    const storage = new Storage({
      projectId: process.env.STORAGE_PROJECT_ID,
      keyFilename: process.env.STORAGE_KEY_FILE_NAME,
    }).bucket(process.env.STORAGE_BUCKET);

    const result = [];
    await Promise.all(
      waitedImages.map(async (el) => {
        const url = await new Promise((resolve, reject) => {
          const fname = `${uuidv4()}`;
          el.createReadStream()
            .pipe(storage.file(el.filename).createWriteStream())
            .on('finish', async () => {
              resolve(
                `https://storage.googleapis.com/${fname}${process.env.STORAGE_BUCKET}/${el.filename}`,
              );
            })
            .on('error', () => reject('실패!!'));
        });
        result.push(url);
      }),
    );

    return result;
  }
}
