import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  world(): string {
    return 'Hello World!';
  }
}
