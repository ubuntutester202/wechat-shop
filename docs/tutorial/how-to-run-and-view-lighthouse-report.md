# 教程：如何正确生成并查看 Lighthouse 性能报告

## 1. 为什么需要 Lighthouse 测试？ (The "Why")

在项目开发中，性能、可访问性（Accessibility）、最佳实践和搜索引擎优化（SEO）是衡量一个 Web 应用质量的关键指标。Lighthouse 是 Google Chrome 开发的一款强大的自动化工具，它能对这些方面进行全面审计，并提供可行的优化建议。

定期运行 Lighthouse 测试并记录基线，能帮助我们：

- **量化性能**：将模糊的“快”或“慢”变成具体的分数和指标。
- **发现问题**：找出潜在的性能瓶颈、可访问性缺陷和安全隐患。
- **指导优化**：根据报告提供的建议，有针对性地进行改进。
- **防止倒退**：在持续集成（CI）中加入测试，确保代码变更不会意外引入性能问题。

本教程将指导你如何在本项目中正确地生成 Lighthouse 报告，并解决查看报告时可能遇到的“白屏”等问题。

## 2. 环境准备 (Prerequisites)

Lighthouse 需要在应用的**生产环境**构建版本上运行，以获取最接近真实用户体验的性能数据。

### 步骤 1：构建生产版本

如果你的 `dist` 目录不存在或不是最新的，请先执行构建命令：

```bash
pnpm build
```

### 步骤 2：启动本地预览服务器

为了模拟真实的线上环境，我们需要一个 HTTP 服务器来托管 `dist` 目录中的静态文件。Vite 内置了方便的预览功能。

```bash
pnpm preview
```

执行后，你会在终端看到类似下面的输出，记下 `Local:` 后面显示的地址（通常是 `http://localhost:4173/`）。我们的 Lighthouse 测试将针对这个地址运行。

```
  ➜  Local:   http://localhost:4173/
  ➜  Network: ...
```

## 3. 正确生成 Lighthouse 报告

我们将介绍两种最常用的报告格式：`html` 和 `json`。

### 关键原则：生成完整报告

为了确保报告能被各种查看器（本地或在线）正确解析，**不要使用** `--only-categories` 或其他过滤标志。我们应该始终生成一份包含所有审计项目的完整报告。

### 方法一：生成 HTML 格式报告

HTML 报告非常直观，包含了图表和详细解释，适合直接分析。

打开一个新的终端窗口（保持 `pnpm preview` 服务器运行），执行以下命令：

```bash
npx --yes lighthouse http://localhost:4173 --output html --output-path docs/lighthouse-report.html --view
```

- `http://localhost:4173`：这是我们预览服务器的地址。
- `--output html`：指定输出格式为 HTML。
- `--output-path docs/lighthouse-report.html`：将报告保存到 `docs` 目录下。
- `--view`：测试完成后自动在浏览器中打开报告。

### 方法二：生成 JSON 格式报告

JSON 报告是原始数据，非常适合用于程序化分析或上传到在线查看器。

```bash
npx --yes lighthouse http://localhost:4173 --output json --output-path docs/lighthouse-report.json
```

lighthouse 默认测试的是您提供 URL 的根路径，在我们的例子里就是首页 (/)。
要测试其他页面，方法非常简单：只需要在 Lighthouse 命令中，提供那个页面的完整 URL 即可。
例如，要测试我们的购物车页面 (/cart)，对应的 URL 就是 http://localhost:4173/cart。同样地，要测试个人中心页面 (/profile)，URL 就是 http://localhost:4173/profile。

```
npx --yes lighthouse http://localhost:4173/cart --output html --output-path docs/lighthouse-report-cart.html --view
```

## 4. 正确查看 Lighthouse 报告

这是最容易出错的环节。请仔细阅读以下两种查看方式。

### 查看 HTML 报告（本地方式）

**错误的做法**：直接在文件管理器中双击 `docs/lighthouse-report.html` 文件。这会使用 `file:///` 协议打开它，由于浏览器的安全策略，报告中的 JavaScript 无法执行，导致你看到一个**空白页面**。

**正确的做法**：使用一个临时的本地 HTTP 服务器来访问它。

1.  打开一个新的终端窗口。
2.  使用 Python 内置的简易服务器，在 `docs` 目录下启动服务：

    ```bash
    # 如果你当前在项目根目录
    python -m http.server 8000 --directory docs

    # 如果你已经 cd 到了 docs 目录
    python -m http.server 8000
    ```

3.  服务器启动后，在浏览器中打开地址：[http://localhost:8000/lighthouse-report.html](http://localhost:8000/lighthouse-report.html)。

现在，你应该能看到完整、可交互的 Lighthouse 报告了。

### 查看 JSON 报告（在线方式）

这是最稳定、最推荐的查看方式，因为它规避了所有本地环境问题。

1.  **打开官方查看器**：访问 [Google Chrome Lighthouse Viewer](https://googlechrome.github.io/lighthouse/viewer/)。
2.  **上传报告**：将我们之前生成的 `docs/lighthouse-report.json` 文件，直接拖拽到网页的指定区域。

网页会立即为你渲染出一份和 HTML 版本完全一样的在线报告。

## 5. 总结与回顾

- **始终在生产构建版本上测试**：先 `pnpm build`，再 `pnpm preview`。
- **始终生成完整报告**：不要使用 `--only-categories` 等过滤标志。
- **始终通过 HTTP 服务器查看 HTML 报告**：不要用 `file://` 协议直接打开。
- **优先使用在线查看器**：上传 JSON 文件到官方查看器是最可靠的方式。

完成测试后，记得手动停止 `pnpm preview` 和 `python -m http.server` 进程。
