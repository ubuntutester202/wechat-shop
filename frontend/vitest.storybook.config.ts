/// <reference types="vitest/config" />
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import path from "node:path";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(new URL(import.meta.url).pathname);

// Storybook 专用测试配置
export default defineConfig({
  plugins: [
    // The plugin will run tests for the stories defined in your Storybook config
    storybookTest({
      configDir: path.join(dirname, ".storybook"),
    }),
  ],
  optimizeDeps: {
    include: [
      "@mdx-js/react",
      "markdown-to-jsx",
      "react/jsx-dev-runtime",
      "@storybook/addon-a11y/preview",
    ],
  },
  test: {
    name: "storybook",
    browser: {
      enabled: true,
      headless: true,
      provider: "playwright",
      instances: [
        {
          browser: "chromium",
        },
      ],
    },
    setupFiles: [".storybook/vitest.setup.ts"],
    // 移除 include/exclude 选项，让 Storybook 插件自动处理
    // 根据警告信息，新版本 Storybook 不建议手动设置这些选项
  },
});
