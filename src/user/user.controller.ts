import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserService } from './user.service';

@ApiTags('Users')
@UseGuards(JwtGuard)
@Controller('users')
@ApiBearerAuth()
export class UserController {
    constructor(private userService: UserService){}

    @Get('me')
    getMe(@GetUser() user: User){
        return user;
    }

    @Get()
    getAll(){
        return this.userService.getAllUsers();
    }
    
}
