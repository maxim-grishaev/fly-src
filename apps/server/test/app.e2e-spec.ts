import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', function (done) {
    request(app.getHttpServer())
      .get('/')
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              byId: expect.any(Object),
              ids: expect.any(Array),
            }),
          }),
        );
      })
      .expect(200, done);
  });
});
