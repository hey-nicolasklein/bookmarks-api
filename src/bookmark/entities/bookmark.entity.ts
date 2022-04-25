import { ApiProperty } from "@nestjs/swagger";
import { Bookmark } from "@prisma/client";
import { Exclude } from "class-transformer";

export class BookmarkEntity implements Bookmark{

    @Exclude()
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
    @ApiProperty()
    userId: number;

    constructor(partial: Partial<BookmarkEntity>) {
        Object.assign(this, partial);
      }

}