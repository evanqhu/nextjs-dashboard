/** 工具函数模块 */

import { Revenue } from "./definitions";

/** 将数字金额格式化为美元货币字符串 */
export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

/** 将日期字符串格式化为本地日期格式 */
export const formatDateToLocal = (dateStr: string, locale: string = "en-US") => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

/** 生成收入图表的 Y 轴标签 */
export const generateYAxis = (revenue: Revenue[]) => {
  // 根据最高记录计算需要在 Y 轴上显示的标签
  // 以 1000 为单位
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

/** 生成分页导航数组 */
export const generatePagination = (currentPage: number, totalPages: number) => {
  // 如果总页数小于等于 7，显示所有页码，不使用省略号
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 如果当前页在前 3 页，显示前 3 页、省略号和最后 2 页
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // 如果当前页在最后 3 页，显示前 2 页、省略号和最后 3 页
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // 如果当前页在中间位置，显示第 1 页、省略号、当前页及其相邻页、省略号和最后一页
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};
