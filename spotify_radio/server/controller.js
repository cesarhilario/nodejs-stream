import { Service } from './service.js';
export class Controller {
  constructor() {
    this.services = new Service();
  }

  async getFileStream(fileName) {
    return this.services.getFileStream(fileName);
  }
}
