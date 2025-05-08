/**
 * Next.js  路由中间件
 */
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// 默认导出中间件函数
// 使用 authConfig 对象初始化 NextAuth.js 中间件，并导出 auth 属性(中间件函数)
export default NextAuth(authConfig).auth;

// 具名导出 config 对象
// 配置中间件
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // 匹配页面路由
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
