import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { BookmarkEntity } from './entities/bookmark.entity';

@ApiTags('Bookmarks')
@UseGuards(JwtGuard)
@Controller('bookmarks')
@ApiBearerAuth()
export class BookmarkController {
    constructor(private service: BookmarkService){}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiOkResponse({status: 201, type: [BookmarkEntity]})
    async getBookmarks(
        @GetUser('id') userId: number){
            const bookmarks = await this.service.getAllBookmarks(userId);
            return bookmarks.map((bookmark) => new BookmarkEntity(bookmark));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    @ApiOkResponse({status: 201, type: BookmarkEntity})
    getBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number
        ){
            return this.service.getBookmarkById(userId, bookmarkId);
    }

    @Post()
    @ApiCreatedResponse({type: BookmarkEntity})
    createBookmark(
        @GetUser('id') userId: number, 
        @Body() body: CreateBookmarkDto
        ){
            return this.service.createBookmark(userId, body);
    }

    @Patch(':id')
    @ApiCreatedResponse({type: BookmarkEntity})
    editBookmarkById(
        @GetUser('id') userId: number, 
        @Param('id', ParseIntPipe) bookmarkId: number,
        @Body() body: EditBookmarkDto){
            return this.service.editBookmark(userId, bookmarkId, body);
    }

    @Delete(':id')
    @ApiOkResponse({type: BookmarkEntity})
    deleteBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number
        ){
            return this.service.deleteBookmark(userId, bookmarkId)

    }
}
