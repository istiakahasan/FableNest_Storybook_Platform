import prisma from "../../lib/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { PrivacyPolicy } from "@prisma/client";
import { sendSupportMail } from "../../utils/sendSupportEmail";

export const PrivacyPolicyService = {
  create: async (payload: Omit<PrivacyPolicy, "id" | "createdAt" | "updatedAt">) => {
    const result = await prisma.privacyPolicy.create({ data: payload });
    return result;
  },

  getById: async (id: string) => {
    const result = await prisma.privacyPolicy.findUnique({ where: { id } });
    if (!result) throw new ApiError(status.NOT_FOUND, "PrivacyPolicy not found!");
    return result;
  },

  getAll: async () => {
    return prisma.privacyPolicy.findMany({ orderBy: { createdAt: "desc" } });
  },

  update: async (id: string, payload: Partial<PrivacyPolicy>) => {
    const existing = await prisma.privacyPolicy.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(status.NOT_FOUND, "PrivacyPolicy not found!");
    }
    const features = Array.from(new Set([...(payload.features ?? []), ...existing.features]));

    const result = await prisma.privacyPolicy.update({
      where: { id },
      data: {
        ...payload,
        features,
      },
    });
    return result;
  },

  delete: async (id: string) => {
    const existing = await prisma.privacyPolicy.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(status.NOT_FOUND, "PrivacyPolicy not found!");
    }
    const result = await prisma.privacyPolicy.delete({ where: { id } });
    return result;
  },

  supportEmail: async (payload: { fullName: string, email: string, phoneNumber: string, message: string }) => {
    await sendSupportMail(payload);
    return {
      done: "Your email sent!"
    }
  }
};
