/// <reference types="vitest/config" />
/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  // Vitest 配置 - 专门用于传统单元测试
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    // 只包含传统测试文件
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    // 排除 Storybook、Playwright 测试和其他文件
    exclude: [
      "tests/**/*",
      "node_modules/**/*",
      "src/**/*.stories.{js,ts,jsx,tsx}",
      "**/*.mdx",
    ],
    // 限制并发数以避免内存问题
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    // 测试覆盖率配置
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "src/mocks/",
        "src/main.tsx",
        "vite.config.ts",
        "**/*.stories.{js,ts,jsx,tsx}",
      ],
    },
  },
});
