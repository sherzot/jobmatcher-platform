import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Min 8 chars, uppercase + lowercase + digit' })
  @IsStrongPassword({ minLength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 0 })
  password: string;

  @ApiProperty({ example: '山田 太郎' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  displayName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
