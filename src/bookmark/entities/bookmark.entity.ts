import { ApiProperty } from "@nestjs/swagger";
import { Bookmark } from "@prisma/client";
import { Exclude } from "class-transformer";

export class BookmarkEntity implements Bookmark{

    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAd: Date;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    link: string;

    @Exclude()
    userId: number;

    @ApiProperty()
    imagePath: string;


    constructor(partial: Partial<BookmarkEntity>) {
        Object.assign(this, partial);
      }

}