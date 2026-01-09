import { AuthResponseDto, AuthReturnDto } from './auth.dto';

export class RefreshTokenReturnDto extends AuthReturnDto {}
export class RefreshTokenResponseDto extends AuthResponseDto {}

export interface GenerateTokensDto {
  refreshToken: string;
  accessToken: string;
}
