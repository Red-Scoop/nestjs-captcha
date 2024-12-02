import {Logger} from "@nestjs/common";
import {CaptchaModuleOptions} from "../captcha.module";
import {Request} from "express";
import CaptchaExceptions from "../captcha.exceptions";

// Выдели отдельные сервисы под hcaptcha и recaptcha. Для них нужны отдельные сервисы.


export type CaptchaRequestData = {
	response: string
	secret: string
	ip?: string | null
}

export type CaptchaServiceOptions = Omit<CaptchaModuleOptions, "hcaptcha" | "recaptcha"> & {
	secretKey?: string,
	// create exception factory
}

export abstract class CaptchaService {
	protected logger = new Logger(CaptchaService.name)

	protected constructor(protected options: CaptchaServiceOptions) {}


	protected abstract request(data: CaptchaRequestData): Promise<boolean>


	async verify(req: Request) {
		const {
			skipIf,
			getClientIp,
			getResponse,
			secretKey
		} = this.options


		if (!secretKey) {
			return true
		}

		if (typeof skipIf !== "undefined" && skipIf(req)) {
			return true
		}

		const ip = getClientIp && getClientIp(req)
		const response = getResponse(req)

		return this.request({
			response,
			secret: secretKey,
			ip
		})

	}


}
