/**
 * 身份验证功能模块
 * 包含认证、登录、登出功能
 * 将 Providers 和 NextAuth 的初始化放在同一个地方
 */
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcryptjs";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/** 根据邮箱查询用户信息的函数 */
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  }
  catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

// 配置并导出 NextAuth 的核心功能：auth（认证）、signIn（登录）、signOut（登出）
export const { auth, signIn, signOut } = NextAuth({
  // 展开基础配置，包含了页面路由、会话设置等
  ...authConfig,
  // 配置 Providers
  providers: [
    // 配置基于 Credentials Provider 的身份验证
    Credentials({
      // authorize 函数：验证用户凭证
      // 如果验证成功返回用户对象，失败返回 null
      async authorize(credentials) {
        // 使用 zod 验证并解析用户提供的凭证
        const parsedCredentials = z
          .object({
            // 验证邮箱格式是否正确
            email: z.string().email(),
            // 验证密码长度是否至少为 6 位
            password: z.string().min(6),
          })
          .safeParse(credentials);

        // 如果凭证格式验证通过
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // 从数据库获取用户信息
          const user = await getUser(email);
          // 如果用户不存在，返回 null
          if (!user) return null;
          // 使用 bcrypt 比较提供的密码和存储的密码哈希是否匹配
          const passwordsMatch = await bcrypt.compare(password, user.password);

          // 如果密码匹配，返回用户对象
          if (passwordsMatch) return user;
        }

        // 记录认证失败信息
        console.log("Invalid credentials");
        // 如果验证失败（格式错误或密码不匹配），返回 null
        return null;
      },
    }),
  ],
});
