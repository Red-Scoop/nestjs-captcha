import {CaptchaRequestData, CaptchaService, CaptchaServiceOptions} from "./captcha.service";
import qs from "qs";
import axios from "axios";
import {Injectable} from "@nestjs/common";
import {CaptchaErrorCode} from "../captcha-error-code.enum";
import CaptchaExceptions, {CaptchaVerifyError} from "../captcha.exceptions";


@Injectable()
export class RECaptchaService extends CaptchaService {

	constructor(public options: CaptchaServiceOptions) {
		super(options);
	}


	async request({response, secret, ip}: CaptchaRequestData) {
		let verifyUrl = "https://www.google.com/recaptcha/api/siteverify"
		const query = qs.stringify({
			secret,
			response,
			remoteip: ip
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

