import status from "http-status";
import { hashPassword } from "./user.utils";
import ApiError from "../../errors/ApiError";
import { User, UserRole } from "@prisma/client";
import prisma from "../../lib/prisma";
import QueryBuilder from "../../builder/QueryBuilder";
import { createLoginToken, createToken } from "../auth/auth.utils";
import config from "../../../config";


export const UserService = {
  register: async (payload: User) => {
    const isUserExist = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (isUserExist) {
      throw new ApiError(status.BAD_REQUEST, "This email is already in use!");
    }

    const hashedPassword = await hashPassword(payload.password ?? "");
    const userData = {
      ...payload,
      password: hashedPassword
    };

    const user = await prisma.user.create({
      data: userData
    })
    const jwtPayload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };

    const accessToken = createLoginToken(
      jwtPayload,
      config.jwt.access_secret as string,
      config.jwt.access_expires_in as string
    );
    return {
      accessToken
    }
  },

  getAll: async (query: Record<string, unknown>) => {

    if (query.isBlocked) {
      query.isBlocked = query.isBlocked === "true" ? true : false;
    }
    const userQuery = new QueryBuilder(prisma.user, query)
      .search(["firstName", "lastName", "email"])
      .filter()
      .paginate();

    const [result, meta] = await Promise.all([
      userQuery.execute(),
      userQuery.countTotal(),
    ]);

    // Remove password from each user
    const data = result.map((user: User) => {
      const { password, ...rest } = user;
      return rest;
    });

    return {
      meta,
      data,
    };
  },
  updateProfile: async (userId: string, payload: Partial<User>) => {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userData) {
      throw new ApiError(status.NOT_FOUND, "User not found!");
    }
    if (!payload.profileImage) {
      payload.profileImage = userData.profileImage;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        profileImage: payload.profileImage || "",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImage: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  },

  changeRole: async (userId: string, role: UserRole) => {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userData) {
      throw new ApiError(status.NOT_FOUND, "User not found!");
    }

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        role
      }
    })

  },

  details: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    });
    if (!user) {
      throw new ApiError(status.NOT_FOUND, "User not found!");
    }

    return user;
  },

  addAdmin: async (payload: User) => {
    const isUserExist = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (isUserExist) {
      throw new ApiError(status.BAD_REQUEST, "This email is already in use!");
    }

    const hashedPassword = await hashPassword(config.super_admin.password as string);
    const userData = {
      ...payload,
      password: hashedPassword,
      role: UserRole.ADMIN
    };
    const user = await prisma.user.create({
      data: userData
    },
    )
    return user
  },

  myProfile: async (userId: string) => {
    // First, fetch user without address
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImage: true,
        role: true,
      },
    });

    if (!user) {
      throw new ApiError(status.NOT_FOUND, "User not found!");
    }
    let address = null;
    if (user.role === UserRole.USER) {
      address = await prisma.address.findUnique({
        where: { userId },
        select: {
          id:true,
          country: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          state: true,
          street: true,
          postCode: true,
          city: true
        }
      },

      );
    }

    return {
      ...user,
      address: address || undefined,
    };
  },


  blockUser: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ApiError(status.NOT_FOUND, "User not found!");
    }
    if (user?.isBlocked) {
      throw new ApiError(status.NOT_FOUND, "User is Already Blocked!");
    }
    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: true,
        suspensionStarts: new Date()
      },
    });

    return result;
  },

  unblockUser: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(status.NOT_FOUND, "User not found!");
    }

    if (user.isBlocked === false) {
      throw new ApiError(status.NOT_ACCEPTABLE, "User already unblocked!")
    }
    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: false,
        suspensionEnds: new Date()
      },
    });

    return result;
  },
  deleteUserFromDB: async (userId: string) => {
    const isUserExist = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!isUserExist) {
      throw new ApiError(status.NOT_FOUND, "User not found!");
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return null;
  }
};
