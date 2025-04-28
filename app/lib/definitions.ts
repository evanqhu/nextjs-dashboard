/**
 * 数据类型定义文件
 * 包含了应用中使用的所有数据类型定义
 * 这些类型定义描述了数据的结构和每个属性应该接受的数据类型
 * 为了教学简单起见，这些类型是手动定义的
 * 如果使用 ORM（如 Prisma），这些类型会自动生成
 */

/**
 * 用户类型定义
 * @property {string} id - 用户唯一标识符
 * @property {string} name - 用户名称
 * @property {string} email - 用户邮箱
 * @property {string} password - 用户密码
 */
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

/**
 * 客户类型定义
 * @property {string} id - 客户唯一标识符
 * @property {string} name - 客户名称
 * @property {string} email - 客户邮箱
 * @property {string} image_url - 客户头像 URL
 */
export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

/**
 * 发票类型定义
 * @property {string} id - 发票唯一标识符
 * @property {string} customer_id - 客户 ID
 * @property {number} amount - 发票金额
 * @property {string} date - 发票日期
 * @property {'pending' | 'paid'} status - 发票状态：待支付或已支付
 */
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: "pending" | "paid";
};

/**
 * 收入类型定义
 * @property {string} month - 月份
 * @property {number} revenue - 收入金额
 */
export type Revenue = {
  month: string;
  revenue: number;
};

/**
 * 最新发票类型定义
 * @property {string} id - 发票 ID
 * @property {string} name - 客户名称
 * @property {string} image_url - 客户头像 URL
 * @property {string} email - 客户邮箱
 * @property {string} amount - 格式化后的发票金额
 */
export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

/**
 * 原始最新发票类型定义
 * 数据库返回的金额是数字类型，但后续会通过 formatCurrency 函数格式化为字符串
 */
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

/**
 * 发票表格类型定义
 * @property {string} id - 发票 ID
 * @property {string} customer_id - 客户 ID
 * @property {string} name - 客户名称
 * @property {string} email - 客户邮箱
 * @property {string} image_url - 客户头像 URL
 * @property {string} date - 发票日期
 * @property {number} amount - 发票金额
 * @property {'pending' | 'paid'} status - 发票状态
 */
export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

/**
 * 客户表格类型定义
 * @property {string} id - 客户 ID
 * @property {string} name - 客户名称
 * @property {string} email - 客户邮箱
 * @property {string} image_url - 客户头像 URL
 * @property {number} total_invoices - 总发票数
 * @property {number} total_pending - 待支付总额
 * @property {number} total_paid - 已支付总额
 */
export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

/**
 * 格式化后的客户表格类型定义
 * total_pending 和 total_paid 被格式化为字符串
 */
export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

/**
 * 客户字段类型定义
 * 用于表单选择器等简化场景
 */
export type CustomerField = {
  id: string;
  name: string;
};

/**
 * 发票表单类型定义
 * 用于创建和编辑发票的表单
 */
export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
};
