# 教程：如何使用 OpenAPI 驱动 API 开发

**目标读者**：所有需要进行 API 接口开发或对接的前后端开发者。

**阅读目的**：理解本项目中“契约先行”的 API 开发工作流，知道当 API 发生变更时，应该修改哪里、执行什么命令，以及这对我们有什么好处。

---

## 1. 为什么需要 OpenAPI？(The "Why")

在传统的开发模式中，前后端接口通常依赖口头约定或零散的文档，这很容易导致沟通成本高、信息不一致、联调效率低等问题。

为了解决这个问题，我们引入了 [OpenAPI 规范](https://www.openapis.org/)（曾用名 Swagger）。它允许我们用一个标准化的 `yaml` 文件来精确地定义所有 API 的路径、参数、请求体和响应数据结构。

这个 `api/openapi.yaml` 文件就是我们项目中 API 的“**单一事实来源 (Single Source of Truth)**”。

这样做的好处是：

- **清晰的契约**：前后端都遵循同一份契约，减少了沟通歧义。
- **自动生成代码**：我们可以基于契约自动生成客户端代码、服务器存根，以及我们最关心的——**TypeScript 类型定义**。
- **并行开发**：一旦契约确定，前后端可以并行开发，互不阻塞。

## 2. 我们的工作流是怎样的？(The "How")

当一个 API 需要被新增、修改或删除时，请严格遵循以下两步流程：

### 第一步：修改契约文件 `api/openapi.yaml`

**这是所有工作的起点。**

无论是为商品详情新增一个字段，还是创建一个全新的用户注册接口，你 **必须** 先在 `api/openapi.yaml` 文件中完成对应的修改。

例如，如果我们想给 `Product`（商品）模型增加一个 `stock`（库存）字段，你需要：

```yaml
# /api/openapi.yaml

# ... (其他定义)

components:
  schemas:
    Product:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        price:
          type: number
        # ... 其他已有字段
        stock: # <= 新增字段
          type: integer
          description: 商品库存数量
# ... (其他定义)
```

### 第二步：运行脚本，生成 TypeScript 类型

修改完契约后，只需在项目根目录运行一个简单的命令：

```bash
pnpm run schema:types
```

这个命令会做什么？

它会调用我们安装的 `openapi-typescript` 工具，该工具会：

1.  读取 `api/openapi.yaml` 文件的最新内容。
2.  自动生成或覆盖 `src/types/api.d.ts` 文件。

执行完毕后，你会在 `src/types/api.d.ts` 中看到刚刚新增的 `stock` 字段已经出现在了 `Product` 类型中。

```typescript
// src/types/api.d.ts - 这个文件是自动生成的，请勿手动修改！

export type paths = { ... };

export type webhooks = Record<string, never>;

export type components = {
  schemas: {
    Product: {
      id?: string;
      name?: string;
      price?: number;
      // ...
      stock?: number; // <= 它自动出现在这里！
    };
    // ...
  };
  // ...
};

// ...
```

## 3. 如何在代码中使用？(The "What")

现在，你可以在你的 React 组件或 Zustand store 中安全地使用这些类型了。IDE 会提供完整的类型提示和自动补全。

```tsx
import { components } from "../types/api"; // 引入生成的类型

type Product = components["schemas"]["Product"];

function ProductDetailCard({ product }: { product: Product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>价格: ¥{product.price}</p>
      {/* 当你输入 product. 时，IDE 会自动提示 stock 字段 */}
      <p>库存: {product.stock}</p>
    </div>
  );
}
```

## 总结

这个工作流确保了我们的前端代码始终与 API 契约保持严格同步，极大地提升了代码的健壮性和开发效率。

**请记住**：

> **API 变更，始于 `openapi.yaml`，终于 `pnpm run schema:types`。**
