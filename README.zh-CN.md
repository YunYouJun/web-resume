# Web-Resume

[![GitHub Pages](https://github.com/YunYouJun/web-resume/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/YunYouJun/web-resume/actions/workflows/gh-pages.yml)

[Vite](https://vitejs.dev/) + [Vue3](https://github.com/vuejs/vue-next/) + [sass](https://sass-lang.com/) + [iconify](https://github.com/iconify) + [YAML](https://yaml.org/) + [Chrome](https://www.google.com/chrome/)

<p align='center'>
<a href="./README.md">English</a> | <b>简体中文</b>
</p>

## Feature

- 在 Web 端显示你的简历
- 可以被打印成 A4 PDF
- 通过 YAML 配置你的简历内容
  - 支持在线编辑预览（如果你需要存储简历，你更应该使用本地的方式）
  - 理论上可以任意换肤，但是抱歉目前还只有这一种 hhh
  - 在线解析
  - YAML 验证，提供字段验证和类型提示（你可能需要安装 [vscode-yaml](https://github.com/redhat-developer/vscode-yaml) 插件）
- PWA
- 自由使用 Web 图标

## Usage

完整的在线编辑、YAML 字段、本地运行、PDF 导出和常见问题说明，请阅读[中文使用手册](./docs/zh/guide/index.md)或[英文使用手册](./docs/guide/index.md)。

### 在线使用

下方导航栏切换至编辑器页面，在线编辑简历对应配置项即可。

在编辑器预览中悬停简历板块，可拖拽板块调整顺序，也可使用上移、下移按钮进行键盘或触屏操作；调整会同步写回 YAML，并可通过编辑器撤销。

自 v0.4 起，新格式尽可能遵循 JSON Resume，图标、板块顺序等展示信息统一存放在 `x-web-resume`。旧版 YAML 仍可直接加载，编辑器会在用户确认后进行可撤销转换。迁移细节见 [v0.4 迁移指南](./docs/migrations/v0.4-json-resume.md)。

内置预置数据使用稳定的 `example` ID，并可与任意模板组合，例如 `https://resume.yunle.fun/?example=graduate&template=compact`。打开 `/explore` 可用同一份数据比较全部模板。

> 图标可参见 [icones](https://icones.js.org/) 使用

### 本地使用

点击仓库右上角 `Use this template`，或 clone 本项目。

> 热加载。

```bash
git clone https://github.com/YunYouJun/web-resume
cd web-resume
pnpm i
pnpm dev
```

#### Command

- 预览: `pnpm dev` (`http://localhost:3000/`)
- 构建: `pnpm build`

#### Custom

##### Resume

自定义 `apps/web/src/assets/resume/local.resume.yml` 的简历文件，支持热加载。

> 本地热加载页面，请进入 `http://localhost:3000`
> 使用 VSCode 还可以有本地 YAML 格式校验哦～

##### Google Analytics

修改 id。

```ts
// apps/web/src/modules/gtag.ts
app.use(VueGtag, {
  property: { id: 'G-W022WEV65N' },
})
```

### Print

使用 Chrome 右键打印，选择另存为 PDF。

> 可自定义缩放比例，测试 78% 左右（自己试试咯）可以一页输出。

也可以通过 CLI 自动导出：

```bash
pnpm export:pdf -- --input ./apps/web/public/resume/suzumiya.resume.yml --output ./resume.pdf
```

输入支持本地 YAML 和 HTTP(S) URL。访问 Cloudflare Access 保护的 URL 时，通过环境变量提供 `CF_ACCESS_CLIENT_ID` 和 `CF_ACCESS_CLIENT_SECRET`。

只读检查或转换旧版 YAML：

```bash
pnpm migrate:resume -- --input ./resume.yml --check
pnpm migrate:resume -- --input ./resume.yml --output ./resume.v0.4.yml
```

新增模板或预置数据后请运行 `pnpm validate:catalog`。目录约定参见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## Ref

整体样式布局，参考自 LaTeX 简历模版 [billryan/resume](https://github.com/billryan/resume/tree/zh_CN)。

与 JSON Resume 当前规范的字段映射、差异和渐进兼容方案见 [JSON Resume 兼容性评估](./docs/zh/reference/json-resume-compatibility.md)。

## 后续计划

- [ ] 集成 `@yunlefun/sso`，提供可选账号与跨设备简历同步；完成前，用户资料和编辑内容仍只保存在当前浏览器。

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/YunYouJun/sponsors/public/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/YunYouJun/sponsors/public/sponsors.svg' alt='赞助者'/>
  </a>
</p>
