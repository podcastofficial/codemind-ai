import { headers } from "next/headers";
import Dashboard from "@/components/dashboard";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  const h = await headers();
  const isTelegram = Boolean(h.get("user-agent")?.includes("Telegram"));
  return <Dashboard authenticated={Boolean(session)} telegramHint={isTelegram} />;
}
