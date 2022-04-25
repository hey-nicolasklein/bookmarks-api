import { ForbiddenException, Injectable } from '@nestjs/common';
import { Bookmark, User } from '@prisma/client';
import { Observable, of } from 'rxjs';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { BookmarkEntity } from './entities/bookmark.entity';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService){}

    async getAllBookmarks(userId: number): Promise<Bookmark[]>{
        const bookmarks = await this.prisma.bookmark.findMany({
            where: {
                userId,
            },
        });

        return bookmarks;
    }

    async getBookmarkById(userId: number, bookmarkId: number){
        const bookmark = await this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId
            },
            select: {
                createdAt: true,
                title: true,
                description: true,
                link: true
            }
        });

        return new BookmarkEntity(bookmark);
    }

    async createBookmark(userId: number, dto: CreateBookmarkDto){
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                ...dto
            }
        })

        return new BookmarkEntity(bookmark);
    }

    async editBookmark(userId: number, bookmarkId: number,  dto: EditBookmarkDto){
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            }
        });

        if(!bookmark || userId != bookmark.userId){
            throw new ForbiddenException('Access to ressource denied');
        }

        console.log({bookmarkId: bookmarkId});

        const updatedBookmark = this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto,
            }
        });

        return new BookmarkEntity(bookmark);
    }

    async addImage(userId: number, bookmarkId: number, imagePath: string){
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            }
        });

        if(!bookmark || userId != bookmark.userId){
            throw new ForbiddenException('Access to ressource denied')
        }

        const updatedBookmark = await this.prisma.bookmark.update({
            where:{
                id: bookmarkId,
            }, 
            data:{
                imagePath: imagePath,
            }
        });

        console.log({updatedBookmark: updatedBookmark});

        return new BookmarkEntity(updatedBookmark);
    }

    async getImage(bookmarkId: number): Promise<string>{
        const bookmark = await this.prisma.bookmark.findUnique({
            where:{
                id: bookmarkId,
            }
        });

        if(!bookmark){
            throw new ForbiddenException('Ressource not found');
        }

        return bookmark.imagePath;
    }

    deleteBookmark(userId: number, bookmarkId: number){}

}
