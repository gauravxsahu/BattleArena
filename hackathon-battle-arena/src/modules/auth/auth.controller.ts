import type { Response } from "express";
import { asyncHandler } from "../../middleware/errorHandler";
import { sendSuccess } from "../../utils/response";
import type { AuthenticatedRequest } from "../../middleware/auth";
import { authService } from "./auth.service";
import { env } from "../../config/env";

const REFRESH_COOKIE = "refreshToken";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    // Frontend (vercel.app) and backend (onrender.com) are different
    // domains, so this is a cross-site request. Browsers only attach
    // cookies to cross-site XHR/fetch calls when sameSite is "none"
    // (and secure must be true for that to be allowed). "lax" silently
    // drops the cookie on cross-site POSTs like /auth/refresh, which
    // caused the 401.
    secure: env.isProduction,
    sameSite: env.isProduction ? "none" : "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, {
    path: "/api/auth",
    secure: env.isProduction,
    sameSite: env.isProduction ? "none" : "lax",
  });
}

export const authController = {
  register: asyncHandler(async (req: AuthenticatedRequest, res) => {
    const tokens = await authService.register(req.body);
    setRefreshCookie(res, tokens.refreshToken);
    sendSuccess(res, { accessToken: tokens.accessToken }, 201);
  }),

  login: asyncHandler(async (req: AuthenticatedRequest, res) => {
    const result = await authService.login(req.body);
    setRefreshCookie(res, result.refreshToken);
    sendSuccess(res, { accessToken: result.accessToken, user: result.user });
  }),

  refresh: asyncHandler(async (req: AuthenticatedRequest, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    const tokens = await authService.refresh(token);
    setRefreshCookie(res, tokens.refreshToken);
    sendSuccess(res, { accessToken: tokens.accessToken });
  }),

  logout: asyncHandler(async (req: AuthenticatedRequest, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    await authService.logout(token);
    clearRefreshCookie(res);
    sendSuccess(res, { loggedOut: true });
  }),

  me: asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = await authService.me(req.user!.id);
    sendSuccess(res, user);
  }),
};