import { CaptchaErrorCode } from './captcha-error-code.enum';


export class CaptchaVerifyError extends Error {
	data: {
		success: false,
		hostname: string,
		'error-codes': CaptchaErrorCode[]
	};
}


export default {
	CaptchaVerifyError,
};
