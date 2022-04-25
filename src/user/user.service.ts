import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async getAllUsers(): Promise<any>{
        const allUsers = await this.prisma.user.findMany({
            select: {
                email: true,
                firstname: true,
                lastname: true,
            }
        });

        return allUsers;
    }
}
