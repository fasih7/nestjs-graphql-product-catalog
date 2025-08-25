import { Response } from 'express';
import { REFRESH_COOKIE } from '../auth/strategies/jwt-refresh.strategy';

export function setRtCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: true, // set false only for local http dev
    sameSite: 'strict', // use 'lax' or 'none' (with secure) if cross-site
    path: '/', // or '/graphql' if you want to scope it
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30d
  });
}

export function clearRtCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: '/' });
}
