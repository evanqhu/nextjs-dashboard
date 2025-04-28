// 导入必要的依赖
import bcrypt from "bcryptjs"; // 用于密码加密
import postgres from "postgres"; // PostgreSQL 数据库客户端
import { invoices, customers, revenue, users } from "../lib/placeholder-data"; // 导入示例数据

// 创建 PostgreSQL 连接实例，启用 SSL
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/** 创建并填充用户表 */
async function seedUsers() {
  // 启用 UUID 扩展
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // 创建用户表（如果不存在）
  // 包含字段：id(UUID), name(用户名), email(邮箱), password(加密后的密码)
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  // 遍历用户数据并插入到数据库
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      // 使用 bcrypt 对密码进行加密
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

/** 创建并填充发票表 */
async function seedInvoices() {
  // 启用 UUID 扩展
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // 创建发票表（如果不存在）
  // 包含字段：id(UUID), customer_id(客户ID), amount(金额), status(状态), date(日期)
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  // 遍历发票数据并插入到数据库
  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedInvoices;
}

/** 创建并填充客户表 */
async function seedCustomers() {
  // 启用 UUID 扩展
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // 创建客户表（如果不存在）
  // 包含字段：id(UUID), name(客户名), email(邮箱), image_url(头像URL)
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  // 遍历客户数据并插入到数据库
  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedCustomers;
}

/** 创建并填充收入表 */
async function seedRevenue() {
  // 创建收入表（如果不存在）
  // 包含字段：month(月份), revenue(收入金额)
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  // 遍历收入数据并插入到数据库
  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `
    )
  );

  return insertedRevenue;
}

/** API 路由处理函数 - GET 请求处理数据库初始化 */
export async function GET() {
  try {
    // 在一个事务中执行所有数据填充操作
    const result = await sql.begin((sql) => [
      seedUsers(), // 填充用户数据
      seedCustomers(), // 填充客户数据
      seedInvoices(), // 填充发票数据
      seedRevenue(), // 填充收入数据
    ]);
    console.log(result);

    // 返回成功响应
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    // 如果发生错误，返回 500 状态码和错误信息
    return Response.json({ error }, { status: 500 });
  }
}
