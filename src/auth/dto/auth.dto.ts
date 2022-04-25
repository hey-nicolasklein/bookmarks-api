import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString,  } from "class-validator";

export class AuthDto{
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}