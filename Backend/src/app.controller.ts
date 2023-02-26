import { Controller, Get, Post, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { LocalAuthGuard } from "./auth/local-auth.guard";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService, private authService: AuthService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

    // ! this is giving 401 unauthorized, why??
    // @UseGuards(LocalAuthGuard) 
    @Post('auth/login')
    async login(@Request() req) {
        // * reminder that req.user is nothing here because we're not using passport right

        if (await this.authService.authenticate(req.body.password)) {
            return this.authService.createJWT();
        }
        return new UnauthorizedException();
    }
}
