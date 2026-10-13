import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // กำหนดเป็น Global เพื่อให้ทุก Module เรียกใช้ PrismaService ได้ทันทีโดยไม่ต้อง import ซ้ำ
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}