import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class RegisterCompanyDto {
  @IsEmail({}, { message: '有効なメールアドレスを入力してください。' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'パスワードは8文字以上にしてください。' })
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'パスワードは大文字・小文字・数字をそれぞれ含む必要があります。',
  })
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  companyName: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyNameEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  prefecture?: string;
}
