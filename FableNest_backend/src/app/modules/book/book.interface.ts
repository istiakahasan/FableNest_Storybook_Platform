import { Gender } from "@prisma/client";

export interface createBookInput {
    characterName: string;
    gender: Gender;
    characterAge: number;
    style: any;
    language: any;
    userId: string;
    user_input: string;
    reference_image_1: string,
    reference_image_2?: string
    reference_image_3?: string
}
