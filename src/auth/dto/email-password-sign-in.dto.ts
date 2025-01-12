import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class EmailPasswordSignInDto {
  @ApiProperty({
    example: 'admin@admin.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
