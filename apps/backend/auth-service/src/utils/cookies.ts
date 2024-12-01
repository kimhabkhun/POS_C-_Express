import config from "@/config";
import { CookieOptions, Response } from "express";

interface CookiesType {
  id_token: string;
  access_token: string;
  refresh_token: string;
}

export const setCookies = (
  res: Response,
  token: CookiesType,
  options: CookieOptions = {}
) => {
  const originCookie: CookieOptions = {
    httpOnly: true,
    secure: config.env === "development",
    sameSite: config.env === "development" ? "none" : "lax",
    maxAge: 1 * 60 * 60 * 1000, //1h
    ...options,
  };

  for (const [key, value] of Object.entries(token)) {
    res.cookie(key, value, originCookie);
  }
};
