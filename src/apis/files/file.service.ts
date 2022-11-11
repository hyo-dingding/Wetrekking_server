import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  async uploadCrewBoard({ files }) {
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
              .pipe(
                storage
                  .file(`crewBoard/${uuid}${el.filename}`)
                  .createWriteStream(),
              )
              .on('finish', () =>
                resolve(`${bucket}/crewBoard/${uuid}${el.filename}`),
              )
              .on('error', () => reject(console.log('실패')));
          }),
      ),
    );
    console.log(result);
    return result;
  }

  async uploadReviewBoard({ files }) {
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
              .pipe(
                storage
                  .file(`reviewBoard/${uuid}${el.filename}`)
                  .createWriteStream(),
              )
              .on('finish', () =>
                resolve(`${bucket}/reviewBoard/${uuid}${el.filename}`),
              )
              .on('error', () => reject(console.log('실패')));
          }),
      ),
    );
    console.log(result);
    return result;
  }

  async uploadUserProfile({ file }) {
    const uuid = uuidv4();
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      projectId: process.env.STORAGE_PROJECT_ID,
      keyFilename: process.env.STORAGE_KEY_FILE_NAME,
    }).bucket(bucket);

    file
      .createReadStream()
      .pipe(
        storage.file(`userProfile/${uuid}${file.filename}`).createWriteStream(),
      )
      .on('finish', () => `${bucket}/userProfile/${uuid}${file.filename}`)
      .on('error', () => console.log('실패'));

    return `${bucket}/userProfile/${uuid}${file.filename}`;
  }
}
