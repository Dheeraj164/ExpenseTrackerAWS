import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("cognitoToken")?.value;
  const path = req.nextUrl.pathname;

  // ✅ Handle root ("/")
  if (path === "/") {
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Handle protected routes
  if (path.startsWith("/dashboard") || path.startsWith("/profile")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const decoded = decodeJwt(token);
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("cognitoToken");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/profile/:path*"],
};
