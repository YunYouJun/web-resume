# Web-Resume

[![GitHub Pages](https://github.com/YunYouJun/web-resume/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/YunYouJun/web-resume/actions/workflows/gh-pages.yml)

[Vite](https://vitejs.dev/) + [Vue3](https://github.com/vuejs/vue-next/) + [sass](https://sass-lang.com/) + [iconify](https://github.com/iconify) + [YAML](https://yaml.org/) + [Chrome](https://www.google.com/chrome/)

<p align='center'>
<b>English</b> | <a href="./README.zh-CN.md">简体中文</a>
</p>

## Feature

- Display your resume on the web
- Can be printed as A4 PDF
- Configure your resume content via YAML
  - Support online editing preview (If you need to store resumes, you should use the local method.)
  - Custom Style
  - Online Parse
  - YAML validation, providing field validation and type hinting (Maybe you need install [vscode-yaml](https://github.com/redhat-developer/vscode-yaml))
- PWA
- Free to use web icons

## Usage

See the complete [English user guide](./docs/guide/index.md) or [Chinese user guide](./docs/zh/guide/index.md) for online editing, YAML fields, local setup, PDF export, and troubleshooting.

### Online

#### Preview

View `https://resume.yunle.fun/?url=` + `Your Resume File URL`.

For example: `https://resume.yunle.fun/?url=https://fastly.jsdelivr.net/gh/YunYouJun/web-resume/apps/web/src/assets/resume/local.resume.yml`.

Built-in preset data uses a stable `example` ID and can be combined with any layout, for example `https://resume.yunle.fun/?example=graduate&template=compact`. Open `/explore` to compare every template with the same selected data.

#### Edit

下方导航栏切换至编辑器页面，在线编辑简历对应配置项即可。

Hover over a resume section in the editor preview to drag it into a new position. The move-up and move-down controls provide keyboard and touch alternatives; changes are written back to YAML and remain undoable in the editor.

Starting with v0.4, new documents follow the JSON Resume structure wherever practical, while presentation data such as icons and section order lives under `x-web-resume`. Legacy YAML still loads directly and is only converted after explicit confirmation. See the [v0.4 migration guide](./docs/migrations/v0.4-json-resume.md).

> 图标可参见 [icones](https://icones.js.org/) 使用

### Local

> You can use it with hot reload.

Click repo `Use this template`, or clone this。

```bash
git clone https://github.com/YunYouJun/web-resume
cd web-resume
pnpm i
pnpm dev
```

#### Command

- Preview: `pnpm dev` (`http://localhost:3000/`)
- Preview resume: `pnpm dev`
- Build: `pnpm build`

#### Custom

##### Resume

Custom `apps/web/src/assets/resume/local.resume.yml` (Hot Reload)

> View `http://localhost:3000/`
> You can use vscode with yaml validate.

##### Google Analytics

Custom ID.

```ts
// apps/web/src/modules/gtag.ts
app.use(VueGtag, {
  property: { id: 'G-W022WEV65N' },
})
```

### Print

Use Chrome to right-click to print and select `Save as PDF`.

You can also export a local YAML file or HTTP(S) URL with the CLI:

```bash
pnpm export:pdf -- --input ./apps/web/public/resume/suzumiya.resume.yml --output ./resume.pdf --template classic
```

For a Cloudflare Access-protected URL, provide `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` as environment variables.

Check or convert a legacy YAML file:

```bash
pnpm migrate:resume -- --input ./resume.yml --check
pnpm migrate:resume -- --input ./resume.yml --output ./resume.v0.4.yml
```

Run `pnpm validate:catalog` after adding a layout or preset data file. See [CONTRIBUTING.md](./CONTRIBUTING.md) for catalog conventions.

> You can customize the zoom ratio, test about 78% (try it yourself), and you can output on one page.

## Ref

Styles refer to LaTeX resume template [billryan/resume](https://github.com/billryan/resume/tree/zh_CN).

See the [JSON Resume compatibility assessment](./docs/zh/reference/json-resume-compatibility.md) for the current field mapping, gaps, and incremental migration strategy.

## Roadmap

- [ ] Integrate `@yunlefun/sso` for optional accounts and cross-device resume sync. Until then, profile and editor data remain local to the browser.

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/YunYouJun/sponsors/public/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/YunYouJun/sponsors/public/sponsors.svg' alt='Sponsors'/>
  </a>
</p>
