import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  async upload({ files }) {
    const waitedFiles = await Promise.all(files);
    console.log(waitedFiles);

    const uuid = uuidv4();
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      projectId: process.env.STORAGE_PROJECT_ID,
      keyFilename: process.env.STORAGE_KEY_FILE_NAME,
    }).bucket(bucket);

    const result = await Promise.all(
      waitedFiles.map(
        (el) =>
          new Promise((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())
              .on('finish', () =>
                resolve(
                  `https://storage.googleapis.com/${bucket}/${uuid}${el.filename}`,
                ),
              )
              .on('error', () => reject(console.log('실패')));
          }),
      ),
    );
    console.log(result);
    return result;
  }
}
