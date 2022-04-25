import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Request } from "express";
import { AuthService } from "./auth.service";import { AuthDto } from "./dto/auth.dto";


@ApiTags('Auth')
@Controller('auth')
export class AuthController{
    constructor (private authService: AuthService){}

    @ApiCreatedResponse({description: 'User Registration'})
    @Post('login')
    login(@Body() dto: AuthDto){
        return this.authService.login(dto);
    }

    @ApiOkResponse({description: 'User Login'})
    @ApiUnauthorizedResponse({description: 'Unauthorized'})
    @HttpCode(HttpStatus.OK)
    @Post('signup')
    signup(@Body() dto: AuthDto){
        return this.authService.signup(dto);
    }
}