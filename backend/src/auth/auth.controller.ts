import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication') // จัดหมวดหมู่ใน Swagger UI
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'สมัครสมาชิกใหม่' })
  @ApiResponse({ status: 201, description: 'สมัครสมาชิกสำเร็จ' })
  @ApiResponse({ status: 409, description: 'Email ถูกใช้งานไปแล้ว' })
  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ message: string }> {
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiOperation({ summary: 'เข้าสู่ระบบเพื่อรับ Access Token' })
  @ApiResponse({ status: 201, description: 'เข้าสู่ระบบสำเร็จ คืนค่า accessToken' })
  @ApiResponse({ status: 401, description: 'Email หรือ Password ไม่ถูกต้อง' })
  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}