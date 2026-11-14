import status from "http-status";
import { AuthService } from "./auth.service";
import catchAsync from "../../helpers/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../helpers/sendResponse";



export const AuthController = {

  login: catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await AuthService.loginUser(email, password);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "User logged In successfully!",
      data: result,

    });
  }),

  changePassword: catchAsync(async (req, res) => {
    const { id: userId } = req.user;
    const { currentPassword, newPassword } = req.body;
    await AuthService.changePassword(userId, currentPassword, newPassword);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "User password changed successfully!",
    });
  }),

  forgotPassword: catchAsync(async (req, res) => {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: result.message,
      data: result,
    });
  }),
  verifyOTP: catchAsync(async (req, res) => {
    const { email, OTP } = req.body;
    const result = await AuthService.verifyOTP(email, OTP);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "OTP verified successfully!",
      data: result,
    });
  }),

  resetPassword: catchAsync(async (req, res) => {
    const { email, newPassword } = req.body;
    const result = await AuthService.resetPassword(
      email,
      newPassword,
    );
    sendResponse(res, {
      statusCode: status.OK,
      message: result.message,
    });
  }),

  resendOTP: catchAsync(async (req, res) => {
    const { email } = req.body;
    await AuthService.resendOtp(email);
    sendResponse(res, {
      statusCode: status.OK,
      message: "New OTP has been sent to your account!",
    });
  })

};
