import fs, { promises as fsPromises } from 'fs';
import { join, extname } from 'path';

import config from './config.js';

const {
  dir: { publicDirectory },
} = config;
export class Service {
  createFileStream(fileName) {
    return fs.createReadStream(fileName);
  }

  async getFileInfo(file) {
    const fullFilePath = join(publicDirectory, file);
    await fsPromises.access(fullFilePath);
    const fileType = extname(fullFilePath);

    return {
      type: fileType,
      name: fullFilePath,
    };
  }

  async getFileStream(file) {
    const { type, name } = await this.getFileInfo(file);

    return {
      stream: this.createFileStream(name),
      type,
    };
  }
}
