import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { BookmarkEntity } from './entities/bookmark.entity';
import { v4 as uuid } from 'uuid';
import { of } from 'rxjs';


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

    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    @Patch('uploadImage/:id')
    @ApiCreatedResponse({type: BookmarkEntity})
    @UseInterceptors(
        FileInterceptor("image", {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    console.log({fileProps: file});
                    const extension: string = extname(file.originalname);
                    const randomName = uuid();
                    callback(null, `${randomName}${extension}`);
                }
            })
        })
    )
    async uploadImage(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
        @UploadedFile() file: Express.Multer.File
    ){
        
        console.log('right route')
        //call service to update bookmark
        const response = {
            originalname: file.originalname,
            filename: file.filename,
          };
        
        console.log({
            savedFile: response
        })

        const updatedBookmark = await this.service.addImage(userId, bookmarkId, file.filename);
        return updatedBookmark;
    }

    @Get('image/:bookmarkId')
    async getImage(
        @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
        @Res() res
    ){
        const imagePath: string = await this.service.getImage(bookmarkId);
        return of(res.sendFile(join(process.cwd(), 'uploads/' + imagePath)));

    }
}
