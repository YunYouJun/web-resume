# Web Resume 使用手册

<p align="center">
  <a href="../../guide/">English</a> | <b>简体中文</b>
</p>

Web Resume 可以将 YAML 文件渲染成网页简历和 A4 PDF。你可以直接在浏览器中体验、从公开 URL 加载简历，也可以在本地运行项目以完整控制数据和构建流程。

## 1. 选择使用方式

| 目标 | 推荐方式 |
| --- | --- |
| 使用示例数据对比布局 | 打开[模板市场](https://resume.yunle.fun/explore) |
| 不安装环境，直接编辑 | 使用在线编辑器 |
| 从 GitHub 或其他托管服务发布简历 | 加载公开的 YAML 原始文件 URL |
| 私密保存或使用本地版本控制 | 在本地运行 Web Resume |
| 稳定、可重复地生成 PDF | 使用 PDF 导出命令行工具 |

在线编辑内容和偏好设置只保存在当前浏览器中，不会写回原始 YAML 文件。如需长期保存、版本历史或跨设备编辑，请另外保存 YAML 源文件。

## 2. 在线使用

### 浏览模板与示例

打开 [`/explore`](https://resume.yunle.fun/explore)，选择一份预置数据，并使用三种内置布局进行比较：

- `classic`：通用的单栏布局
- `sidebar`：突出个性的双栏布局
- `compact`：适合单页简历的紧凑布局

切换模板只改变展示方式，不会改写简历数据。

### 加载 YAML 文件

选择 **文件 → 加载简历**，输入 YAML 文件的直接访问地址并加载。托管文件的服务器必须：

- 返回 YAML 内容，而不是 HTML 页面；
- 通过 CORS 允许 Web Resume 发起跨域请求；
- 无需交互式登录即可访问。

简历摘要与要点可以包含轻量的行内 HTML。渲染外部内容前，Web Resume 会移除可执行标签、事件属性、不安全的链接协议和不支持的标记。

如果文件托管在 GitHub，请使用原始文件地址，例如：

```text
https://raw.githubusercontent.com/OWNER/REPOSITORY/BRANCH/resume.yml
```

也可以直接拼接访问链接：

```text
https://resume.yunle.fun/?url=经过编码的_YAML_URL&template=classic
```

支持以下查询参数：

| 参数 | 可用值 | 用途 |
| --- | --- | --- |
| `url` | URL 编码后的 YAML 地址 | 加载自定义简历 |
| `example` | 内置示例 ID | 加载预置数据 |
| `template` | `classic`、`sidebar`、`compact` | 选择布局 |
| `mode` | `preview` | 隐藏应用操作界面 |

数据源使用 `url` 或 `example` 之一。例如：

```text
https://resume.yunle.fun/?example=graduate&template=compact&mode=preview
```

### 编辑简历

通过导航栏或命令面板打开编辑器。修改 YAML 时，编辑器会校验内容并同步更新预览。

在预览区域中，可以拖动板块调整顺序。键盘和触屏用户也可以使用上移、下移按钮。排序结果会写回 YAML 文本，并可在编辑器中撤销。

对于标准格式，展示顺序写入 `x-web-resume.sectionOrder`，不会修改各标准板块的数据；对于旧格式，编辑器会调整对应顶层 YAML 块的顺序。排序控件仅在编辑器页面显示，分享预览中不会出现。

常用命令：

- `Ctrl/Cmd + Shift + P`：打开 Web Resume 命令面板
- `F1`：在编辑器页面打开编辑器命令
- **格式化 YAML**：格式化当前文档
- **恢复示例**：将编辑内容替换为默认示例；紧接着的恢复操作可撤销

### 选择模板和设置偏好

通过 **视图 → 模板** 选择布局，也可以在设置页配置。设置页还可以修改主题、界面语言和本地个人信息覆盖。

个人信息覆盖可以替换已加载简历中显示的姓名、电话和邮箱。个人信息只保存在当前浏览器中，且仅在启用覆盖时生效；它不会修改 YAML 源文件。

### 分享预览

选择 **文件 → 复制分享链接**。链接包含源文件 URL 或内置示例 ID、所选模板和预览模式，不包含未保存的编辑器文本，也不包含浏览器本地个人信息。如需分享修改结果，请先把更新后的 YAML 发布到可访问的地址，再加载该地址。

### 转换旧版简历

旧版 Web Resume 文件仍可直接加载，且不会被自动重写。当编辑器检测到旧版 `contact`、`project.sets` 等结构时，会显示 **检查并转换**。确认前请检查提示：语义不明确的项目、奖项、地址、日期和 YAML 注释可能需要人工处理。转换只产生一次编辑操作，可以立即使用撤销恢复原文本。

使用本地文件时，也可以通过命令行检查或转换：

```bash
pnpm migrate:resume -- --input ./resume.yml --check
pnpm migrate:resume -- --input ./resume.yml --output ./resume.v0.4.yml
```

命令不会隐式覆盖输入文件。字段映射、风险提示和回退方式见 [v0.4 中文迁移指南](../migrations/v0.4-json-resume.md)。

## 3. 编写 YAML 文件

YAML 通过缩进表示层级。请使用空格并保持缩进一致；对于可能被 YAML 识别成其他类型的值，建议使用引号。新文件应采用 JSON Resume 字段结构，YAML 只是书写语法。JSON Resume 的各板块均为可选项，可以从实际需要的字段开始。

最小可用示例：

```yaml
basics:
  name: Ada Lovelace
  label: 软件工程师
  summary: 用可靠的工具解决真实问题。
  email: ada@example.com
  phone: +44 1234 567890
  url: https://example.com
  location:
    city: 伦敦

work:
  - name: Analytical Engines Ltd.
    position: 软件工程师
    startDate: 2024-01
    highlights:
      - 为用户构建可靠的工具。

x-web-resume:
  version: 1
  sectionOrder: [work]
```

顶层字段说明：

| 字段 | 内容 |
| --- | --- |
| `basics` | 姓名、职位、简介、头像、邮箱、电话、URL、地址和社交资料 |
| `work` | 工作经历 |
| `volunteer` | 志愿经历 |
| `education` | 教育经历 |
| `awards` / `certificates` | 奖项和证书 |
| `publications` | 出版物 |
| `skills` | 技能分组与关键词 |
| `languages` / `interests` / `references` | 语言、兴趣和推荐信息 |
| `projects` | 项目经历 |
| `meta` | 规范地址、版本和更新时间等元数据 |
| `x-web-resume` | 图标、Logo、自定义内容、板块顺序等 Web Resume 专属展示数据 |

只要标准字段能准确表达含义，就优先使用标准字段；图标、布局等专属信息统一放在 `x-web-resume` 下，避免新增零散的顶层字段。详细映射见 [JSON Resume 兼容性评估](../reference/json-resume-compatibility.md)，编辑器接受的完整结构见 [`apps/web/src/assets/schema/resume.schema.json`](https://github.com/YunYouJun/web-resume/blob/main/apps/web/src/assets/schema/resume.schema.json)。

选择 **文件 → 导出标准 JSON Resume** 可以下载 canonical `.resume.json` 副本。Portable 导出会递归移除 `x-web-resume` 和非标准字段，并在下载前重新校验；编辑器中的原文和展示设置不会改变。

图标使用 [Iconify](https://iconify.design/) 名称，例如 `ri:mail-line`，可在 [Icônes](https://icones.js.org/) 搜索。条目的 `logo` 字段也支持图片路径或 HTTP(S) URL；项目与机构 Logo 推荐优先使用 SVG，以便在不同输出尺寸下保持清晰。生成网页或 PDF 时，远程图片必须保持可访问。

```yaml
logo: /img/project-logo.svg
# 或：https://cdn.example.com/project-logo.svg
# 或 Iconify 名称：ri:github-line
```

## 4. 本地运行

### 环境要求

- Node.js 22.12 或更高版本
- pnpm 10（仓库已固定具体的包管理器版本）
- Chrome 或 Chromium，用于打印和自动导出 PDF

### 安装与预览

点击仓库的 **Use this template** 创建项目，或克隆本仓库：

```bash
git clone https://github.com/YunYouJun/web-resume.git
cd web-resume
corepack enable
pnpm install
pnpm dev
```

将自己的 YAML 文件放在 `apps/web/public/resume/` 下，例如 `apps/web/public/resume/my.resume.yml`，然后打开：

```text
http://localhost:3000/?url=/resume/my.resume.yml
```

Vite 会从站点根路径提供 `apps/web/public/` 中的文件。修改 YAML 源文件后请刷新页面；也可以通过 **文件 → 加载简历** 加载该本地地址。

建议执行以下检查：

```bash
pnpm typecheck
pnpm lint
pnpm build
```

生产构建结果位于 `dist/`。构建完成后，可以运行 `pnpm preview` 在本地检查。

如需在 VS Code 中获得 YAML 补全和校验，请安装 [YAML by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)，并在 `.vscode/settings.json` 中将简历文件与仓库 schema 关联：

```json
{
  "yaml.schemas": {
    "./apps/web/src/assets/schema/resume.schema.json": [
      "**/*.resume.yml"
    ]
  }
}
```

## 5. 导出 PDF

### 浏览器打印

选择 **文件 → 导出 PDF**，或按 `Ctrl/Cmd + P`。在打印对话框中：

1. 选择 **另存为 PDF**。
2. 使用 A4 纸张。
3. 如果浏览器提供该选项，请启用背景图形。
4. 如果最后一个板块落到额外页面，适当调整缩放比例。

推荐使用 Chrome 或 Chromium，因为不同浏览器的打印渲染结果可能不同。

### 命令行导出

导出本地文件：

```bash
pnpm export:pdf -- \
  --input ./apps/web/public/resume/neutral.resume.yml \
  --output ./resume.pdf \
  --template classic \
  --scale 1
```

导出线上文件：

```bash
pnpm export:pdf -- --input https://example.com/resume.yml --output ./resume.pdf
```

参数说明：

| 参数 | 说明 |
| --- | --- |
| `-i`、`--input` | 必填，本地 YAML 路径或 HTTP(S) URL |
| `-o`、`--output` | 输出路径，默认为 `resume.pdf` |
| `--template` | `classic`、`sidebar` 或 `compact`，默认为 `classic` |
| `--scale` | `0.1` 到 `2` 之间的打印缩放，默认为 `1` |
| `--no-build` | 复用现有 `dist/` 目录 |

命令会先校验 YAML，再进行渲染；默认还会构建应用。如果本机缺少 Playwright 使用的 Chromium，请安装：

```bash
pnpm exec playwright install chromium
```

若 URL 受 Cloudflare Access 保护，导出前需要同时设置两个环境变量：

```bash
export CF_ACCESS_CLIENT_ID=your-client-id
export CF_ACCESS_CLIENT_SECRET=your-client-secret
pnpm export:pdf -- --input https://example.com/resume.yml
```

## 6. 常见问题

### URL 返回 HTML，而不是 YAML

请使用文件的直接地址或 raw 地址。仓库展示页和登录跳转通常返回 HTML，无法解析成简历。

### 在线应用无法加载有效的 YAML URL

检查页面提示的 HTTP 状态或浏览器控制台。文件服务器必须允许跨域请求；如果无法修改 CORS 策略，请更换托管位置，或在本地运行 Web Resume。

### 修改后预览消失

从编辑器报告的第一个 YAML 语法或 schema 错误开始修复。常见原因包括使用 Tab、缩进不一致、值中包含未加引号的冒号，或在标准数组板块中混用了旧版对象结构。

### 分享后对方看到的个人信息不同

检查公开简历时请关闭本地个人信息覆盖。浏览器本地保存的个人信息不会包含在分享链接中。

### PDF 多出一页

可以尝试 `compact` 模板、精简内容，或略微调低打印缩放。生成后请检查 PDF 是否存在文字裁切或远程图片加载失败。
