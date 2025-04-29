import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// 使用 authConfig 对象初始化 NextAuth.js，并导出 auth 属性
export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
