import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({ example: 'dev@example.com', description: 'อีเมลผู้ใช้งาน' })
  @IsEmail({}, { message: 'รูปแบบ Email ไม่ถูกต้อง' })
  @IsNotEmpty({ message: 'Email ห้ามเป็นค่าว่าง' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'รหัสผ่าน (อย่างน้อย 6 ตัวอรรถ)' })
  @IsString()
  @MinLength(6, { message: 'Password ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' })
  password: string;

  @ApiPropertyOptional({ example: 'Dev User', description: 'ชื่อผู้ใช้งาน (ระบุหรือไม่ก็ได้)' })
  @IsOptional()
  @IsString()
  name?: string;
}