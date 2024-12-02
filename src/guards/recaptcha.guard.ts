import {CanActivate, ExecutionContext, Injectable, Logger} from "@nestjs/common";
import {Request} from "express";
import {RECaptchaService} from "../services/recaptcha.service";
import {CaptchaGuard} from "./captcha.guard";

@Injectable()
export class RECaptchaGuard implements CanActivate {
	protected logger = new Logger(RECaptchaGuard.name)

	constructor(protected service: RECaptchaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		return await new CaptchaGuard(this.service).canActivate(context)
	}
}
