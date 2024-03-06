import { Test, TestingModule } from '@nestjs/testing';
import { HelloService } from '../hello/hello.service';

describe('HelloService', () => {
  let service: HelloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelloService],
    }).compile();

    service = module.get(HelloService);
  });

  it('should be defined', () => {
    service.world();
    expect(service.world()).toBe('Hello World!');
  });
});
