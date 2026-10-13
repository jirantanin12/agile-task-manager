import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // เชื่อมต่อกับ Database ทันทีที่ NestJS Module เริ่มทำงาน
    await this.$connect();
  }
}