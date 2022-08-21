import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import config from '../../../server/config.js';
import { Controller } from '../../../server/controller.js';

import { handler } from '../../../server/routes.js';
import TestUtil from '../_util/testUtil.js';

const {
  pages: { homeHTML, controllerHTML },
  location,
  constants: { CONTENT_TYPE },
} = config;

describe('#Routes - test suite for api response', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('GET / - should redirect to home page', async () => {
    const params = makeHandlerParams();

    await handler(...params.values());

    expect(params.response.writeHead).toHaveBeenCalledWith(302, {
      Location: location.home,
    });
    expect(params.response.end).toHaveBeenCalled();
  });

  test(`GET /home - should respond with ${homeHTML} a file stream`, async () => {
    const params = makeHandlerParams('GET', '/home');
    const mockFileStream = makeMockFileStream();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(homeHTML);
    expect(mockFileStream.pipe).toBeCalledWith(params.response);
  });

  test(`GET /controller - should respond with ${controllerHTML} a file stream`, async () => {
    const params = makeHandlerParams('GET', '/controller');
    const mockFileStream = makeMockFileStream();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(controllerHTML);
    expect(mockFileStream.pipe).toBeCalledWith(params.response);
  });

  test(`GET /index.html - should respond with a file stream`, async () => {
    const fileName = '/index.html';
    const params = makeHandlerParams('GET', fileName);
    const mockFileStream = makeMockFileStream();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(fileName);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    expect(params.response.writeHead).toHaveBeenCalledWith(200, {
      'Content-Type': CONTENT_TYPE['.html'],
    });
  });

  test.todo(`GET /unknown - given an inexistent route, it should respond with 404`);

  describe('exceptions', () => {
    test.todo('given an inexistent file, it should respond with a 404');
    test.todo('given an error file, it should respond with 500');
  });
});

// Helpers
function makeMockFileStream(type = '.html') {
  const mockFileStream = TestUtil.generateReadableStream(['data']);

  jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name).mockResolvedValue({
    stream: mockFileStream,
    type,
  });
  jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

  return mockFileStream;
}

function makeHandlerParams(method = 'GET', url = '/') {
  const params = TestUtil.defaultHandlerParams();
  params.request.method = method;
  params.request.url = url;
  return params;
}
