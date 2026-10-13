import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. ระบบสมัครสมาชิก (Sign-Up)
 async signUp(authCredentialsDto: AuthCredentialsDto): Promise<{ message: string }> {
    const { email, password, name } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      return { message: 'สมัครสมาชิกสำเร็จ' };
    } catch (error: any) { // ระบุเป็น any เพื่อให้อ่าน error.code ได้
      if (error?.code === 'P2002') {
        throw new ConflictException('Email นี้ถูกใช้งานในระบบแล้ว');
      }
      throw new InternalServerErrorException();
    }
  }

  // 2. ระบบเข้าสู่ระบบ (Sign-In)
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    // ตรวจเช็ก User และเปรียบเทียบ Password ที่ Hash แล้ว
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, email: user.email };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Email หรือ Password ไม่ถูกต้อง');
    }
  }
}