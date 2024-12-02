import {CanActivate, ExecutionContext, Injectable, Logger} from "@nestjs/common";
import {Request} from "express";
import {HCaptchaService} from "../services/hcaptcha.service";
import {CaptchaGuard} from './captcha.guard';

@Injectable()
export class HCaptchaGuard implements CanActivate {
	protected logger = new Logger(HCaptchaGuard.name)

	constructor(protected service: HCaptchaService) {

	}


	async canActivate(context: ExecutionContext): Promise<boolean> {
		return await new CaptchaGuard(this.service).canActivate(context)
	}

}
