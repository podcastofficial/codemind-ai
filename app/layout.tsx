import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeMind AI",
  description: "Your AI-powered software development workspace"
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090d18"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
