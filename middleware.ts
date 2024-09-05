import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // TODO: Set middlewares with roles
  // const cookie = cookies().get("session")?.value;
  // if (request.nextUrl.pathname.match("/") && !cookie) {
  //   return NextResponse.rewrite(new URL("/auth/login", request.url));
  // }
  // if (request.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.rewrite(new URL("/dashboard/user", request.url));
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};
