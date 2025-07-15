import { expect, test } from "@playwright/test";

// 辅助函数：模拟用户登录
async function mockLogin(page: any) {
  // 执行 mock 登录
  await page.evaluate(() => {
    // 模拟用户数据
    const mockUser = {
      id: "mock-user-1",
      name: "张三",
      nickname: "小张",
      email: "zhangsan@example.com",
      phone: "13800138000",
      avatar: "",
      createdAt: new Date().toISOString(),
    };

    const mockToken = "mock-token-" + Date.now();

    // 设置 localStorage
    localStorage.setItem("authToken", mockToken);

    // 设置 zustand store
    const userStorage = {
      state: {
        isLoggedIn: true,
        user: mockUser,
        token: mockToken,
      },
      version: 0,
    };

    localStorage.setItem("user-storage", JSON.stringify(userStorage));
  });
}

/**
 * E2E 测试：购物车到订单的完整流程
 * 测试用户从购物车选择商品、填写地址、确认订单到创建订单的完整业务流程
 */
test.describe("购物车到订单 E2E 测试", () => {
  test.beforeEach(async ({ page }) => {
    // 每个测试前都访问首页并进行 mock 登录
    await page.goto("/");
    await mockLogin(page);
    // 清空购物车持久化数据，避免商品累加
    await page.evaluate(() => localStorage.removeItem("cart-storage"));
    // 清空 mockCartItems
    await page.request.delete("/api/cart");
  });

  test("完整的购物车到订单流程", async ({ page }) => {
    // 1. 直接进入商城页面（已在 beforeEach 中登录）
    await page.goto("/shop");
    await expect(page.getByText("Flash Sale")).toBeVisible();

    // 2. 点击第一个商品进入详情页
    const firstProduct = page
      .locator(".bg-white.rounded-lg.shadow-sm.overflow-hidden.cursor-pointer")
      .first();
    await firstProduct.click();

    // 3. 等待跳转到商品详情页
    await page.waitForURL(/\/product\/\d+/);
    await page.waitForLoadState("networkidle");

    // 在商品详情页添加到购物车
    await expect(
      page.getByRole("heading", { name: /时尚休闲连帽卫衣/ })
    ).toBeVisible(); // 商品标题

    // 等待加入购物车按钮可见
    await expect(page.getByText("加入购物车")).toBeVisible();

    // 点击添加到购物车按钮
    await page.getByText("加入购物车").click();

    // 等待规格选择弹框出现
    await expect(page.getByText("选择规格")).toBeVisible();

    // 点击弹框中的确认按钮（也是"加入购物车"）
    await page.locator('button:has-text("加入购物车"):last-of-type').click();

    // 4. 验证弹框关闭（表示添加成功）
    await expect(page.getByText("选择规格")).not.toBeVisible({ timeout: 3000 });

    // 5. 进入购物车页面
    await page.goto("/cart");
    await expect(page.getByText(/购物车/)).toBeVisible();

    // 6. 验证购物车中有商品
    const cartItems = page.locator(".bg-white.p-4.rounded-lg.shadow-sm.mb-3");
    await expect(cartItems).toHaveCount(1, { timeout: 5000 });

    // 7. 选择商品（如果没有默认选中）
    const selectCheckbox = page.locator('button[title*="选择"]').first();
    // 检查商品是否已选中，未选中时才点击
    const isSelected = await selectCheckbox
      .getAttribute("class")
      .then((cls) => cls?.includes("border-red-500 bg-red-500"));
    if (!isSelected) {
      await selectCheckbox.click();
    }

    // 等待结算按钮变为可用状态
    const checkoutButton = page.getByText(/结算/);
    await expect(checkoutButton).toBeEnabled({ timeout: 5000 });

    // 8. 点击结算按钮
    await checkoutButton.click();

    // 9. 进入结算页面
    await expect(page).toHaveURL("/checkout");
    await expect(page.getByText("确认订单")).toBeVisible();

    // 10. 验证商品信息显示正确
    await expect(page.getByText(/商品清单/)).toBeVisible();

    // 11. 验证收货地址信息
    await expect(page.getByText("收货地址")).toBeVisible();
    await expect(page.getByText("张三")).toBeVisible();
    await expect(page.getByText("13800138000")).toBeVisible();

    // 12. 验证价格计算
    await expect(page.getByText(/商品小计/)).toBeVisible();
    await expect(page.getByText(/运费/)).toBeVisible();
    // 只断言费用明细部分的“实付款”可见，避免 strict mode 报错
    const feeDetail = page.locator("div.bg-white.mb-2.px-4.py-4");
    await expect(feeDetail.getByText("实付款", { exact: true })).toBeVisible();

    // 13. 点击立即支付
    // 捕获 alert 弹窗内容并断言，避免 click 卡死
    await Promise.all([
      page.waitForEvent("dialog").then((dialog) => {
        expect(dialog.message()).toContain("支付功能暂未接入");
        return dialog.dismiss();
      }),
      page.getByRole("button", { name: /去支付/i }).click(),
    ]);
  });

  test("购物车为空时的处理", async ({ page }) => {
    // 1. 直接进入购物车页面
    await page.goto("/cart");

    // 2. 验证空购物车状态
    await expect(page.getByRole("heading", { name: /购物车/ })).toBeVisible();
    await expect(page.getByText("购物车是空的")).toBeVisible();

    // 3. 验证结算按钮状态 - 空购物车时应该没有结算按钮
    const checkoutButton = page.getByText(/结算/);
    await expect(checkoutButton).not.toBeVisible();
  });

  test("购物车商品数量调整", async ({ page }) => {
    // 1. 先添加商品到购物车（重复上面的步骤）
    await page.goto("/shop");

    const firstProduct = page
      .locator(".bg-white.rounded-lg.shadow-sm.overflow-hidden.cursor-pointer")
      .first();
    await firstProduct.click();

    // 等待跳转到商品详情页
    await page.waitForURL(/\/product\/\d+/);
    await page.waitForLoadState("networkidle");

    // 等待加入购物车按钮可见
    await expect(page.getByText("加入购物车")).toBeVisible();

    await page.getByText("加入购物车").click();
    // 等待规格选择弹框出现并选择规格
    await expect(page.getByText("选择规格")).toBeVisible();
    await page.locator('button:has-text("加入购物车"):last-of-type').click();
    await expect(page.getByText("选择规格")).not.toBeVisible({ timeout: 3000 });

    // 2. 进入购物车
    await page.goto("/cart");

    // 3. 测试数量增加
    const increaseButton = page.locator('button[title="增加数量"]').first();
    await increaseButton.click();

    // 4. 验证数量变化
    const quantityDisplay = page
      .locator(".text-md.font-medium.w-8.text-center")
      .first();
    await expect(quantityDisplay).toHaveText("2");

    // 5. 测试数量减少
    const decreaseButton = page.locator('button[title="减少数量"]').first();
    await decreaseButton.click();
    await expect(quantityDisplay).toHaveText("1");
  });

  test("购物车商品移除功能", async ({ page }) => {
    // 1. 先添加商品到购物车
    await page.goto("/shop");

    const firstProduct = page
      .locator(".bg-white.rounded-lg.shadow-sm.overflow-hidden.cursor-pointer")
      .first();
    await firstProduct.click();

    // 等待跳转到商品详情页
    await page.waitForURL(/\/product\/\d+/);
    await page.waitForLoadState("networkidle");

    // 等待加入购物车按钮可见
    await expect(page.getByText("加入购物车")).toBeVisible();

    await page.getByText("加入购物车").click();
    // 等待规格选择弹框出现并选择规格
    await expect(page.getByText("选择规格")).toBeVisible();
    await page.locator('button:has-text("加入购物车"):last-of-type').click();
    await expect(page.getByText("选择规格")).not.toBeVisible({ timeout: 3000 });

    // 2. 进入购物车
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /购物车/ })).toBeVisible();

    // 3. 移除商品
    const removeButton = page.locator('button[title*="移除"]').first();
    await expect(removeButton).toBeVisible({ timeout: 5000 });
    await removeButton.click();

    // 4. 验证商品已移除
    await expect(page.getByText("购物车是空的")).toBeVisible();
  });

  test("结算页面地址编辑功能", async ({ page }) => {
    // 1. 先添加商品并进入结算页面
    await page.goto("/shop");

    const firstProduct = page
      .locator(".bg-white.rounded-lg.shadow-sm.overflow-hidden.cursor-pointer")
      .first();
    await firstProduct.click();

    // 等待跳转到商品详情页
    await page.waitForURL(/\/product\/\d+/);
    await page.waitForLoadState("networkidle");

    // 等待加入购物车按钮可见
    await expect(page.getByText("加入购物车")).toBeVisible();

    await page.getByText("加入购物车").click();
    // 等待规格选择弹框出现并选择规格
    await expect(page.getByText("选择规格")).toBeVisible();
    await page.locator('button:has-text("加入购物车"):last-of-type').click();
    await expect(page.getByText("选择规格")).not.toBeVisible({ timeout: 3000 });

    await page.goto("/cart");

    // 选择商品
    const selectCheckbox = page.locator('button[title*="选择"]').first();
    // 检查商品是否已选中，未选中时才点击
    const isSelected = await selectCheckbox
      .getAttribute("class")
      .then((cls) => cls?.includes("border-red-500 bg-red-500"));
    if (!isSelected) {
      await selectCheckbox.click();
    }

    // 等待结算按钮变为可用状态
    const checkoutButton = page.getByText(/结算/);
    await expect(checkoutButton).toBeEnabled({ timeout: 5000 });

    await checkoutButton.click();

    // 2. 点击修改地址
    await page.getByText("修改").click();

    // 3. 修改收货人姓名
    const nameInput = page.locator('input[placeholder="收货人姓名"]');
    await nameInput.clear();
    await nameInput.fill("李四");

    // 4. 修改手机号
    const phoneInput = page.locator('input[placeholder="手机号"]');
    await phoneInput.clear();
    await phoneInput.fill("13900139000");

    // 5. 保存地址
    await page.getByRole("button", { name: "保存地址" }).click();

    // 6. 验证地址更新
    await expect(page.getByText("李四")).toBeVisible();
    await expect(page.getByText("13900139000")).toBeVisible();
  });

  test("购物车全选功能", async ({ page }) => {
    // 1. 添加多个商品到购物车
    await page.goto("/shop");

    // 添加第一个商品
    const firstProduct = page
      .locator(".bg-white.rounded-lg.shadow-sm.overflow-hidden.cursor-pointer")
      .first();
    await firstProduct.click();

    // 等待跳转到商品详情页
    await page.waitForURL(/\/product\/\d+/);
    await page.waitForLoadState("networkidle");

    // 等待加入购物车按钮可见
    await expect(page.getByText("加入购物车")).toBeVisible();

    await page.getByText("加入购物车").click();
    // 等待规格选择弹框出现并选择规格
    await expect(page.getByText("选择规格")).toBeVisible();
    await page.locator('button:has-text("加入购物车"):last-of-type').click();
    await expect(page.getByText("选择规格")).not.toBeVisible({ timeout: 3000 });

    // 返回商城页面添加第二个商品
    await page.goto("/shop");
    const secondProduct = page
      .locator(".bg-white.rounded-lg.shadow-sm.overflow-hidden.cursor-pointer")
      .nth(1);
    await secondProduct.click();

    // 等待跳转到商品详情页
    await page.waitForURL(/\/product\/\d+/);
    await page.waitForLoadState("networkidle");

    // 等待加入购物车按钮可见
    await expect(page.getByText("加入购物车")).toBeVisible();

    await page.getByText("加入购物车").click();
    // 等待规格选择弹框出现并选择规格
    await expect(page.getByText("选择规格")).toBeVisible();
    await page.locator('button:has-text("加入购物车"):last-of-type').click();
    await expect(page.getByText("选择规格")).not.toBeVisible({ timeout: 3000 });

    // 2. 进入购物车
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /购物车/ })).toBeVisible();

    // 3. 验证购物车中有多个商品
    const cartItems = page.locator(".bg-white.p-4.rounded-lg.shadow-sm.mb-3");
    await expect(cartItems).toHaveCount(2, { timeout: 5000 });

    // 4. 测试全选功能
    const selectAllButton = page.getByRole("button", { name: /全选/i });
    if (await selectAllButton.isVisible()) {
      // 等待商品渲染
      const cartItems = page.locator(".bg-white.p-4.rounded-lg.shadow-sm.mb-3");
      const count = await cartItems.count();
      expect(count).toBeGreaterThan(0);
      // 先确保所有商品都未选中
      for (let i = 0; i < count; i++) {
        const selectCheckbox = cartItems
          .nth(i)
          .locator('button[title*="选择"]');
        const isSelected = await selectCheckbox
          .getAttribute("class")
          .then((cls) => cls?.includes("border-red-500 bg-red-500"));
        if (isSelected) {
          await selectCheckbox.click();
        }
      }
      // 点击全选按钮
      await selectAllButton.click();
      // 等待所有商品都被选中
      await expect
        .poll(
          async () => {
            let allSelected = true;
            for (let i = 0; i < count; i++) {
              const selectCheckbox = cartItems
                .nth(i)
                .locator('button[title*="选择"]');
              const isSelected = await selectCheckbox
                .getAttribute("class")
                .then((cls) => cls?.includes("border-red-500 bg-red-500"));
              if (!isSelected) {
                allSelected = false;
                break;
              }
            }
            return allSelected;
          },
          { timeout: 3000 }
        )
        .toBeTruthy();
      // 验证结算按钮可用
      const checkoutButton = page.getByRole("button", { name: /结算/i });
      await expect(checkoutButton).toBeEnabled();

      // 再次点击全选，取消选择
      await selectAllButton.click();
      await expect(checkoutButton).toBeDisabled();
    }
  });
});
