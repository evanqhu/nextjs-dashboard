"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/** 表单验证 */
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

/** 创建时的表单验证 */
const CreateInvoice = FormSchema.omit({ id: true, date: true });

/** 更新时的表单验证 */
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

/** 创建发票 */
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // 将金额转换为美分
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // 插入数据到数据库
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  // 因为数据会缓存，所以需要重新验证路径，重新从服务器获取数据
  revalidatePath("/dashboard/invoices");
  // 重定向到 invoices 页面
  redirect("/dashboard/invoices");
}

/** 更新发票 */
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

/** 删除发票 */
export async function deleteInvoice(id: string) {
  // throw new Error("Failed to Delete Invoice");
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  // 触发新的服务器请求并重新渲染表格
  revalidatePath("/dashboard/invoices");
}
