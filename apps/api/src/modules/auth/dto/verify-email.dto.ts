import { IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @Length(6, 6, { message: '確認コードは6桁の数字です。' })
  code: string;
}
