import status from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../helpers/sendResponse";
import { getImageUrl } from "../../helpers/uploadFile";


export const UserController = {


  register: catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.register(req.body);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "User registered successfully!",
      data: result,
    });
  }),

  addAdmin: catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.addAdmin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Admin added successfully!",
      data: result,
    });
  }),
  getAll: catchAsync(async (req, res) => {
    const result = await UserService.getAll(req.query);
    sendResponse(res, {
      statusCode: status.OK,
      message: "Users are retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }),

  changeRole: catchAsync(async (req, res) => {
    const result = await UserService.changeRole(req.params.id, req.body.role);
    sendResponse(res, {
      statusCode: status.OK,
      message: "Role Changed successfully!",
      data: result,
    });
  }),


  updateProfile: catchAsync(async (req, res) => {
    const { id } = req.user;
    const payload = req.body;
    if (req.file) {
      const profileImage = await getImageUrl(req.file as any);
      payload.profileImage = profileImage
    }
    const result = await UserService.updateProfile(id, payload);
    sendResponse(res, {
      statusCode: status.OK,
      message: "User updated successfully!",
      data: result,
    });
  }),

  myProfile: catchAsync(async (req, res) => {
    const { id } = req.user;
    const result = await UserService.myProfile(id);
    sendResponse(res, {
      statusCode: status.OK,
      message: "My Profile fetched successfully!",
      data: result,
    });
  }),



  details: catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await UserService.details(id);
    sendResponse(res, {
      statusCode: status.OK,
      message: "User retrieved successfully!",
      data: result,
    });
  }),

  blockUser: catchAsync(async (req, res) => {
    const { userId } = req.params;
    await UserService.blockUser(userId);
    sendResponse(res, {
      statusCode: status.OK,
      message: "User blocked successfully!",
    });
  }),
  
  unblockUser: catchAsync(async (req, res) => {
    const { userId } = req.params;
    await UserService.unblockUser(userId);
    sendResponse(res, {
      statusCode: status.OK,
      message: "User unblocked successfully!",
    });
  }),
  deleteUser: catchAsync(async (req, res) => {
    const { userId } = req.params;
    await UserService.deleteUserFromDB(userId);
    sendResponse(res, {
      statusCode: status.OK,
      message: "User deleted successfully!",
    });
  })
};
