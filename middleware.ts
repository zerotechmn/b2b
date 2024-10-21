import { auth } from "./auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  if (nextUrl.pathname.startsWith("/auth")) {
    if (isAuthenticated) return Response.redirect(new URL("/", nextUrl));
  } else {
    if (!isAuthenticated)
      return Response.redirect(new URL("/auth/login", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
