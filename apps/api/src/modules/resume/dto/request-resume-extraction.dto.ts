import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class RequestResumeExtractionDto {
  @ApiProperty({ example: 'resumes-raw/candidate-1/resume.pdf' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Matches(/^(?!.*:\/\/).+$/, {
    message: 'documentObjectKey must be an object key, not a URL',
  })
  documentObjectKey: string;

  @ApiProperty({
    description: 'Lowercase SHA-256 digest of the stored document',
  })
  @Matches(/^[a-f0-9]{64}$/)
  documentSha256: string;

  @ApiProperty({ description: 'Client-generated retry key' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(70)
  idempotencyKey: string;
}
