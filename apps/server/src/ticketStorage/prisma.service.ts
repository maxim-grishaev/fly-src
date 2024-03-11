import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// TODO: extract into a separate module
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    return this.$connect();
  }
}
