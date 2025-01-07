import {CaptchaRequestData, CaptchaService, CaptchaServiceOptions} from "./captcha.service";
import qs from "qs";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Injectable, Logger} from "@nestjs/common";
import CaptchaExceptions, {CaptchaVerifyError} from "../captcha.exceptions";
import {CaptchaErrorCode} from "../captcha-error-code.enum";


@Injectable()
export class HCaptchaService extends CaptchaService {
	protected logger = new Logger(HCaptchaService.name)


	constructor(protected options: CaptchaServiceOptions) {
		super(options);
	}


	async request({response, secret, ip}: CaptchaRequestData) {
		let verifyUrl = "https://api.hcaptcha.com/siteverify"
		const query = qs.stringify({
			secret,
			response,
			remoteip: ip,

		})


		const resp = await axios.post(`${verifyUrl}?${query}`, null, {
			headers: {
				'Accept': 'application/json',
				"Content-Type": "application/json"
			},
			responseType: "json",
			httpAgent: this.agent,
			httpsAgent: this.agent
		})


		const data = resp.data as {
			success: boolean,
		}

		if (!data.success) {
			const e = new CaptchaExceptions.CaptchaVerifyError()
			e.data = data as any
			throw e
		}

		return data.success
	}


}
