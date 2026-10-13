import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail({}, { message: 'รูปแบบ Email ไม่ถูกต้อง' })
  @IsNotEmpty({ message: 'Email ห้ามเป็นค่าว่าง' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' })
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}