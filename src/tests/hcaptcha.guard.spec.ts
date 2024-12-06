import {ConsoleLogger, Controller, ForbiddenException, INestApplication, Post, UseGuards} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {CaptchaModule} from "../captcha.module";
import axios, {AxiosInstance} from "axios";
import {HCaptchaGuard} from "../guards/hcaptcha.guard";
import {CaptchaErrorCode} from "../captcha-error-code.enum";
import CaptchaExceptions, {CaptchaVerifyError} from "../captcha.exceptions";


@Controller(`captcha`)
export class CaptchaController {

	@Post(`siteverify`)
	@UseGuards(HCaptchaGuard)
	async check() {
		return {
			success: true
		}
	}
}

describe(`HCaptchaGuard`, () => {
	let app: INestApplication
	let instance: AxiosInstance
	const responseHeader = "X-Captcha-Response"


	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [
				CaptchaModule.forRoot({
					getResponse: (req) => {
						return req.header(responseHeader) as string
					},
					getClientIp: (req) => {
						return "127.0.0.1"
					},
					hcaptcha: {
						secretKey: "<secretKey>"
					},
					skipIf: (req) => {
						return Boolean(req.header(`X-Captcha-Skip`))
					},
					createHttpException: (e) => {
						if (e instanceof CaptchaVerifyError) {
							throw new ForbiddenException({
								message: "Captcha not passed",
								errorCodes: e.data["error-codes"],
							})
						}
						throw new ForbiddenException({
							message: `Captcha provider return unexpected result`
						})
					},
				})

			],
			controllers: [CaptchaController]
		})
			.setLogger(new ConsoleLogger())
			.compile()


		app = module.createNestApplication()
		await app.init()
		const {port} = app.getHttpServer().listen().address();

		instance = axios.create({
			baseURL: `http://localhost:${port}`,
		})
	})


	beforeEach(async () => {

	})


	afterAll(async () => {
		await app.close()
	})


	it('should HCaptchaGuard throw error', async () => {
		let data!: {
			errorCodes: CaptchaErrorCode[]
		}
		try {
			const resp = await instance.post(`captcha/siteverify`, null, {
				headers: {
					[responseHeader]: "<invalid>"
				}
			})

		} catch (e: any) {
			data = e.response.data
		}

		expect(data.errorCodes.includes(CaptchaErrorCode.InvalidInputResponse)).toBe(true)

	});

	it('should skip checks works', async () => {
		const resp = await instance.post(`captcha/siteverify`, null, {
			headers: {
				"X-Captcha-Skip": "..."
			}
		})

		expect(resp.data.success).toBe(true)
	});

	it(`should exception factory works`, async () => {
		try {
			const resp = await instance.post(`captcha/siteverify`, null, {
				headers: {
					[responseHeader]: "invalid captcha response"
				}
			})
		} catch (e: any) {
			expect(e.response.data.message).toBeDefined()
		}


	})

})
