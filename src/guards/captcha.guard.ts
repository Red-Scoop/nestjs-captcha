import {Request} from "express";
import {CanActivate, ExecutionContext, ForbiddenException} from "@nestjs/common";
import {Observable} from "rxjs";
import CaptchaExceptions, {CaptchaVerifyError} from "../captcha.exceptions";
import {AxiosError} from "axios";
import {CaptchaService, CaptchaServiceOptions} from "../services/captcha.service";


export class CaptchaGuard implements CanActivate {
	constructor(
		protected service: CaptchaService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>()
		try {
			return await this.service.verify(req)
		} catch (e) {
			// @ts-ignore
			throw this.service.options.createHttpException(e)
		}


    }



}
