import {DynamicModule, Module} from "@nestjs/common";
import type {Request} from "express";
import {HCaptchaService} from "./services/hcaptcha.service";
import {RECaptchaService} from "./services/recaptcha.service";
import {AxiosError} from "axios";
import CaptchaExceptions, {CaptchaVerifyError} from "./captcha.exceptions";


export type CaptchaModuleOptions = {
	getResponse: (request: Request) => string,
	getClientIp?: (request: Request) => string | null | undefined,
	skipIf?: (request: Request) => boolean,

	// captcha service error to http exception
	createHttpException: (e: CaptchaVerifyError | AxiosError | unknown) => Error

	// proxies: any[]
	hcaptcha?: {
		secretKey: string,
	}
	recaptcha?: { // v2
		secretKey: string,
	},
}


@Module({})
export class CaptchaModule {
	static forRoot({hcaptcha, recaptcha, ...configuration}: CaptchaModuleOptions): DynamicModule {
		return {
			module: CaptchaModule,
			imports: [],
			providers: [
				{
					provide: HCaptchaService,
					useFactory: () => {
						return new HCaptchaService({
							...configuration,
							secretKey: hcaptcha?.secretKey
						})
					}
				},
				{
					provide: RECaptchaService,
					useFactory: () => {
						return new RECaptchaService({
							...configuration,
							secretKey: recaptcha?.secretKey
						})
					}
				},

			],
			exports: [HCaptchaService, RECaptchaService], // К этому будут иметь доступ все гуарды.
			controllers: [],
			global: true
		}
	}
}
