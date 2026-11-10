import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "codemind_session";
function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters");
  return new TextEncoder().encode(value);
}
export async function createSession(user: { id: string; telegramId: string }) {
  const token = await new SignJWT({ telegramId: user.telegramId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession() {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || !payload.telegramId) return null;
    return { userId: payload.sub, telegramId: String(payload.telegramId) };
  } catch { return null; }
}
