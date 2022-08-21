import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import config from '../../../server/config.js';
import { Controller } from '../../../server/controller.js';

import { handler } from '../../../server/routes.js';
import TestUtil from '../_util/testUtil.js';

const {
  pages: { homeHTML, controllerHTML },
  location,
} = config;

describe('#Routes - test suite for api response', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('GET / - should redirect to home page', async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/';

    await handler(...params.values());

    expect(params.response.writeHead).toHaveBeenCalledWith(302, {
      Location: location.home,
    });
    expect(params.response.end).toHaveBeenCalled();
  });

  test(`GET /home - should respond with ${homeHTML} a file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/home';
    const mockFileStream = TestUtil.generateReadableStream(['data']);

    jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name).mockResolvedValue({
      stream: mockFileStream,
    });
    jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(homeHTML);
    expect(mockFileStream.pipe).toBeCalledWith(params.response);
  });

  test.todo(`GET /controller - should respond with ${controllerHTML} a file stream`);
  test.todo(`GET /file.ext - should respond with a file stream`);
  test.todo(`GET /unknown - given an inexistent route, it should respond with 404`);

  describe('exceptions', () => {
    test.todo('given an inexistent file, it should respond with a 404');
    test.todo('given an error file, it should respond with 500');
  });
});
