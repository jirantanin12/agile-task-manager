import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      secretOrKey: 'superSecretKey123',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { id: string; email: string }): Promise<User> {
    const { id } = payload;
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('Token ไม่ถูกต้อง หรือไม่พบผู้ใช้งานนี้');
    }

    return user; // NestJS จะนำ user ตัวนี้ไปแปะไว้ที่ req.user ให้อัตโนมัติ
  }
}