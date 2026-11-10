import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { verifyTelegramInitData } from "@/lib/telegram";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  if (path.join("/") === "health") {
    return NextResponse.json({
      ok: true,
      app: "CodeMind AI",
      phase: 1,
      timestamp: new Date().toISOString()
    });
  }
  return NextResponse.json({ error: "API endpoint not found" }, { status: 404 });
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const endpoint = path.join("/");

  if (endpoint === "auth/telegram") {
    try {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      if (!token || !process.env.DATABASE_URL) {
        return NextResponse.json({ error: "Server is not configured" }, { status: 503 });
      }
      const body = await req.json();
      const telegramUser = verifyTelegramInitData(String(body.initData || ""), token);
      const result = await pool.query(
        `INSERT INTO users (telegram_id, username, first_name)
         VALUES ($1, $2, $3)
         ON CONFLICT (telegram_id) DO UPDATE
         SET username = EXCLUDED.username, first_name = EXCLUDED.first_name
         RETURNING id, telegram_id, first_name`,
        [String(telegramUser.id), telegramUser.username ?? null, telegramUser.first_name ?? null]
      );
      const user = result.rows[0];
      await pool.query(
        `INSERT INTO credit_wallets (user_id, balance)
         VALUES ($1, 100) ON CONFLICT (user_id) DO NOTHING`,
        [user.id]
      );
      await createSession({ id: user.id, telegramId: String(user.telegram_id) });
      return NextResponse.json({ ok: true, user: { firstName: user.first_name } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed";
      return NextResponse.json({ error: message }, { status: 401 });
    }
  }

  return NextResponse.json({ error: "API endpoint not found" }, { status: 404 });
}
