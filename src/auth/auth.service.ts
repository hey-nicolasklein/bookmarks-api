import { ForbiddenException, Injectable, Req } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService, 
        private config: ConfigService) { }

    async login(dto: AuthDto) {
        // find the user
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });
        // if user does not exist throw exception
        if (!user) throw new ForbiddenException('user does not exist');

        console.log(user);

        // compare password
        const pwMatches = await argon.verify(user.hash, dto.password);

        // if password incorrect throw exception
        if (!pwMatches) throw new ForbiddenException('password wrong');

        return await this.signToken(user.id, user.email);
    }
    async signup(dto: AuthDto) {
        //Generate password hash
        const hash = await argon.hash(dto.password);

        console.log(dto);

        try {
            //Save to db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            })
            
            return await this.signToken(user.id, user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code == 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '24h',
            secret: this.config.get('JWT_SECRET')
        });

        return {access_token: token};
    }
}