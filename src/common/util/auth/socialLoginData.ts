import axios from 'axios';
import { ISocialLogin } from '../../../apis/auth/interface/auth.interface';
import CustomError from '../../error/customError';

export const socialLoginData = async ({
    socialLoginDTO,
}: ISocialLogin) => {
    const { provider, accessToken } = socialLoginDTO;

    const data =
        provider === 'kakao'
            ? 'https://kapi.kakao.com/v2/user/me'
            : provider === 'google'
            ? 'https://www.googleapis.com/userinfo/v2/me'
            : 'https://openapi.naver.com/v1/nid/me';

    try {
        const result = await axios.get(data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return provider === 'google'
            ? result.data.email
            : provider === 'kakao'
            ? result.data.kakao_account.email
            : result.data._json.email;
    } catch (error) {
        throw new CustomError('엑세스 토큰이 유효하지 않습니다', 400);
    }
};
