import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Post, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { AuthDto } from "./auth/dto/auth.dto";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService, private authService: AuthService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

    // @UseGuards(AuthGuard()) 
    @Post('auth/login')
    async login(@Body() auth: AuthDto) {
        if (await this.authService.authenticate(auth.password)) {
            return this.authService.createJWT();
        }
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

}
