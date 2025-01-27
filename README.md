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

### Online

#### Preview

View `https://web-resume.yunyoujun.cn/#/?url=` + `Your Resume File URL`.

For example: `https://web-resume.yunyoujun.cn/#/?url=https://fastly.jsdelivr.net/gh/YunYouJun/web-resume/src/assets/resume/local.resume.yml`.

#### Edit

下方导航栏切换至编辑器页面，在线编辑简历对应配置项即可。

> 图标可参见 [icones](https://icones.js.org/) 使用

### Local

> You can use it with hot reload.

Click repo `Use this template`, or clone this。

```bash
git clone https://github.com/YunYouJun/web-resume
cd web-resume
pnpm i
pnpm run resume
```

#### Command

- Preview: `pnpm dev` (`http://localhost:3000/`)
- Preview Resume：`pnpm resume`
- Build: `pnpm build`

#### Custom

##### Resume

Custom `src/assets/resume/local.resume.yml` (Hot Reload)

> View `http://localhost:3000/`
> You can use vscode with yaml validate.

##### Google Analytics

Custom ID.

```ts
// src/modules/gtag.ts
app.use(VueGtag, {
  property: { id: 'G-W022WEV65N' },
})
```

### Print

Use Chrome to right-click to print and select `Save as PDF`.

> You can customize the zoom ratio, test about 78% (try it yourself), and you can output on one page.

## Ref

Styles refer to LaTeX resume template [billryan/resume](https://github.com/billryan/resume/tree/zh_CN).

## Todo

- [ ] Drag Card
- [ ] 中英文使用手册
- [ ] How about keeping it consistent with [jsonresume](https://jsonresume.org/)?
  - [resume-schema](https://github.com/jsonresume/resume-schema)
  - [schema.json](https://raw.githubusercontent.com/jsonresume/resume-schema/master/schema.json)

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/YunYouJun/sponsors/public/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/YunYouJun/sponsors/public/sponsors.svg'/>
  </a>
</p>
