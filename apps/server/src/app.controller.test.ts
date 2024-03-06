import { Test, TestingModule } from '@nestjs/testing';
import { RootController } from './app.controller';
import { PowerusService } from './powerus/powerus.service';
import { HelloService } from './hello/hello.service';
import { VendorsService } from './vendors/vendors.service';

describe('AppController', () => {
  let appController: RootController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RootController],
      providers: [PowerusService, HelloService, VendorsService],
    }).compile();

    appController = app.get(RootController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.helloWorld()).toBe('Hello World!');
    });
  });
});
