import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Runs every day at 12:00 AM
 * Cron format: minute hour day month dayOfWeek
 */
export const startPromoExpiryCron = () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            const now = new Date();

            const result = await prisma.promoCode.updateMany({
                where: {
                    endTime: {
                        lt: now,
                    },
                    isActive: true,
                },
                data: {
                    isActive: false,
                },
            });

            console.log(
                `⏰ Promo expiry cron ran: ${result.count} promo codes expired`
            );
        } catch (error) {
            console.error("❌ Promo expiry cron failed:", error);
        }
    });

    console.log("🕒 Promo expiry cron job started");
};
