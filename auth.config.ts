/**
 * Next.js 身份验证配置文件
 * 用于设置登录、授权和重定向规则
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // 自定义身份验证页面的路由配置
  pages: {
    signIn: "/login", // 将默认的登录页面路由指向 /login
  },
  callbacks: {
    // authorized 回调用于验证请求是否有权使用 Next.js 中间件访问页面。它在请求完成之前调用，并接收一个包含 auth 和 request 属性的对象。 auth 属性包含用户的会话， request 属性包含传入的请求。
    authorized({ auth, request: { nextUrl } }) {
      // 检查用户是否已登录（通过验证 auth.user 是否存在）
      const isLoggedIn = !!auth?.user;
      // 检查用户是否正在访问仪表板页面（URL 是否以 /dashboard 开头）
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true; // 如果用户已登录且访问仪表板，允许访问
        return false; // 如果用户未登录但尝试访问仪表板，重定向到登录页面
      } else if (isLoggedIn) {
        // 如果用户已登录但访问其他页面（如登录页），重定向到仪表板
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      // 对于其他所有情况（如未登录用户访问公共页面），允许访问
      return true;
    },
  },
  // 身份验证提供者配置数组，当前为空
  providers: [],
} satisfies NextAuthConfig;
