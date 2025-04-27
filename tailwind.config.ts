/** 配置 Tailwind CSS */
import type { Config } from 'tailwindcss';

const config: Config = {
  // 指定需要扫描 class 的文件路径，Tailwind 会根据这些文件生成最终的 CSS
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // pages 目录下所有相关文件
    './components/**/*.{js,ts,jsx,tsx,mdx}', // components 目录下所有相关文件
    './app/**/*.{js,ts,jsx,tsx,mdx}', // app 目录下所有相关文件
  ],
  theme: {
    extend: {
      // 扩展自定义的网格列数
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))', // 新增 13 列布局
      },
      // 扩展自定义颜色
      colors: {
        blue: {
          400: '#2589FE', // 浅蓝色
          500: '#0070F3', // 主蓝色
          600: '#2F6FEB', // 深蓝色
        },
      },
    },
    // 自定义动画关键帧
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)', // 实现 shimmer 效果的动画
        },
      },
    },
  },
  // 引入 Tailwind CSS 的表单插件，优化表单样式
  plugins: [require('@tailwindcss/forms')],
};
export default config;
