import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyTelegramInitData(initData: string, botToken: string) {
  if (!initData || initData.length > 10_000) throw new Error("Invalid Telegram initData");
  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");
  if (!receivedHash || !/^[a-f0-9]{64}$/i.test(receivedHash)) throw new Error("Missing Telegram hash");
  params.delete("hash");
  const dataCheckString = [...params.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("\\n");
  const secretKey = createHmac("sha256", botToken).update("WebAppData").digest();
  const calculated = createHmac("sha256", secretKey).update(dataCheckString).digest();
  const received = Buffer.from(receivedHash, "hex");
  if (received.length !== calculated.length || !timingSafeEqual(received, calculated)) throw new Error("Telegram signature verification failed");
  const authDate = Number(params.get("auth_date"));
  if (!Number.isFinite(authDate) || Math.floor(Date.now() / 1000) - authDate > 86_400 || authDate > Math.floor(Date.now() / 1000) + 60) {
    throw new Error("Telegram login data expired");
  }
  const userRaw = params.get("user");
  if (!userRaw) throw new Error("Telegram user missing");
  const user = JSON.parse(userRaw) as { id?: number; username?: string; first_name?: string };
  if (!user.id) throw new Error("Invalid Telegram user");
  return user;
}
