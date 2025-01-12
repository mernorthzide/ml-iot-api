import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class EmailPasswordSignInDto {
  @ApiProperty({
    example: 'admin@ml-iot.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'Password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
