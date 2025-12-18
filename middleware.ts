import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function generateUUID(): string {
  // Use Web Crypto API which is available in Edge Runtime
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const deviceId = req.cookies.get("device_id")?.value;

  if (!deviceId) {
    res.cookies.set("device_id", generateUUID(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

