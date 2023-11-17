import { IsString } from 'class-validator';

export class SocialLoginDTO {
    @IsString()
    provider: string;

    @IsString()
    accessToken: string;

    constructor(data: SocialLoginDTO) {
        this.provider = data.provider;
        this.accessToken = data.accessToken;
    }
}
