import { UserRole } from "@prisma/client";
import config from "../../config"
import prisma from "../lib/prisma"
import bcrypt from "bcrypt"

export const seedSuperAdmin = async () => {
    const admin = await prisma.user.findUnique({
        where: {
            email: config.super_admin.email
        },
        select: {
            role: true
        }
    });

    if (!admin) {
        const hashedPassword = await bcrypt.hash(config.super_admin.password!, 10)
        await prisma.user.create({
            data: {
                firstName: "Super",
                lastName: "Admin",
                role: UserRole.SUPER_ADMIN,
                email: config.super_admin.email!,
                password: hashedPassword,
                profileImage: "https://i.ibb.co.com/vC0htHb9/emma-Watson.jpg"
            }
        })
        console.log("🧙‍♂️ Super Admin seeded successfully!")
    }

}