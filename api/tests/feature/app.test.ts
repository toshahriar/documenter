import request from 'supertest';
import app from '@/app';
import { appConfig } from '@/config/app';

describe('GET /', () => {
  it('should return app status', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      message: 'Application is running!',
      data: {
        name: appConfig.NAME,
        env: appConfig.ENV,
        debug: appConfig.DEBUG,
      },
    });
  });
});
