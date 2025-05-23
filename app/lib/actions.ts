/**
 * 数据库操作相关的功能模块
 * 包含了所有与数据库交互的函数
 */
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/** ****************** invoice actions ****************** */
/** 表单验证状态类型 */
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

/** 表单验证规则 */
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce.number().gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

/** 创建时的表单验证 */
const CreateInvoice = FormSchema.omit({ id: true, date: true });

/** 更新时的表单验证 */
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

/** 创建发票 */
// prevState - 包含从 useActionState 钩子传递过来的状态
export async function createInvoice(prevState: State, formData: FormData) {
  // 验证表单数据
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    // 返回异步操作的当前状态
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  // 将金额转换为美分
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // 插入数据到数据库
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  }
  catch (error) {
    console.error("Database Error: Failed to Create Invoice.", error);
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // 因为数据会缓存，所以需要重新验证路径，重新从服务器获取数据
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
  // 重定向到 invoices 页面
  redirect("/dashboard/invoices");
}

/** 更新发票 */
export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  }
  catch (error) {
    console.error("Database Error: Failed to Update Invoice.", error);
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
  redirect("/dashboard/invoices");
}

/** 删除发票 */
export async function deleteInvoice(id: string) {
  // throw new Error("Failed to Delete Invoice");
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  }
  catch (error) {
    console.error("Database Error: Failed to Delete Invoice.", error);
  }
  // 触发新的服务器请求并重新渲染表格
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
}

/** ****************** auth actions ****************** */
/** 登录认证 */
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", formData);
  }
  catch (error) {
    if (error instanceof AuthError) {
      switch ((error as any).type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
