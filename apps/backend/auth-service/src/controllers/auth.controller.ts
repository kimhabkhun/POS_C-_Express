import { Controller, Route, Tags, Post, Body, Request } from "tsoa";
import express from "express";
import authService from "@/services/auth.service";
import { setCookies } from "@/utils/cookies";
import {
  SignInRequest,
  SignUpRequest,
  VerifyUserRequest,
} from "./types/auth.types";

@Route("/v1/auth")
export class AuthController extends Controller {
  @Post("/signup")
  @Tags("SignUp")
  async signup(
    @Body() reqBody: SignUpRequest
  ): Promise<{ message: string; required?: string }> {
    try {
      await authService.signup(reqBody);
      return {
        message: "Success Register!✅",
        required: "Please Confirm Verification!",
      };
    } catch (error) {
      //@ts-ignore
      if (error.name === "UsernameExistsException") {
        this.setStatus(403);
        return { message: "User already exist!" };
      } else {
        throw error;
      }
    }
  }
  @Post("/verify")
  @Tags("Confirm SignUp")
  async confirmSignup(@Body() reqBody: VerifyUserRequest) {
    try {
      await authService.confirmSignup(reqBody);
      return {
        message: "Success Verify! You can now Logged in ✅",
      };
    } catch (error) {
      throw error;
    }
  }
  @Post("/login")
  @Tags("Login")
  async login(@Body() reqBody: SignInRequest, @Request() req: express.Request) {
    try {
      const tokens = await authService.login(reqBody);
      const tokenParams = {
        id_token: tokens?.IdToken!,
        access_token: tokens?.AccessToken!,
        refresh_token: tokens?.RefreshToken!,
      };
      const res = req.res as express.Response;
      setCookies(res, tokenParams);
      return {
        message: "Loggined Success!✅",
      };
    } catch (error) {
      throw error;
    }
  }
}
