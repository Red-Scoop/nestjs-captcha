# Captcha module

## Installation

```shell
npm install --save @red-scoop/nestjs-captcha 
```

## Usage

```typescript
// app.module.ts
import { HttpException, Module } from '@nestjs/common';
import { CaptchaModule, CaptchaVerifyError } from '@red-scoop/nestjs-captcha';
import { getClientIp } from 'request-ip';

@Module({
	imports: [
		CaptchaModule.forRoot({
			getResponse: (req) => {
				return req.header(`X-Captcha-Response`) as string;
			},
			getClientIp: (req) => {
				return getClientIp(req);
			},
			createHttpException: (e) => {
				if (e instanceof CaptchaVerifyError) {
					throw new ForbiddenException({
						message: 'Captcha not passed',
						errorCodes: e.data['error-codes'],
					});
				}
				throw new ForbiddenException({
					message: `Captcha provider return unexpected result`,
				});
			},
			skipIf: (req) => {
				return process.NODE_ENV !== 'production';
			},
			hcaptcha: {
				secretKey: '<secretKey>',
			},
			recaptcha: {
				secretKey: '<secretKey>',
			},
		}),
	],
})
export class AppModule {}
```

```typescript
// app.controller.ts
import { Controller, Post, UseGuards } from "@nestjs/common";
import { HCaptchaGuard, RECaptchaGuard } from "@red-scoop/nestjs-captcha";


@Controller("app")
export class AppController {

	@Post(`recaptcha`)
	@UseGuards(RECaptchaGuard)
	async recaptcha() {
		// Logic...
	}


	@Post(`hcaptcha`)
	@UseGuards(HCaptchaGuard)
	async hcaptcha() {
		// Logic...
	}
}
```
