# Web-Resume

[![GitHub Pages](https://github.com/YunYouJun/web-resume/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/YunYouJun/web-resume/actions/workflows/gh-pages.yml)

[Vite](https://vitejs.dev/) + [Vue3](https://github.com/vuejs/vue-next/) + [sass](https://sass-lang.com/) + [iconify](https://github.com/iconify) + [YAML](https://yaml.org/) + [Chrome](https://www.google.com/chrome/)

## Feature

- 在 Web 端显示你的简历
- 可以被打印成 A4 PDF
- 通过 YAML 配置你的简历内容
  - **支持在线编辑预览**
  - 理论上可以任意换肤，但是抱歉目前还只有这一种 hhh
  - 在线解析
  - YAML 验证，提供字段验证和类型提示（你可能需要安装 [vscode-yaml](https://github.com/redhat-developer/vscode-yaml) 插件）
- PWA
- 自由使用 Web 图标

## Usage

### 在线使用

下方导航栏切换至编辑器页面，在线编辑简历对应配置项即可。

> 图标可参见 [icones](https://icones.js.org/) 使用

### 本地使用

点击仓库右上角 `Use this template`，或 clone 本项目。

> 热加载。

```bash
git clone https://github.com/YunYouJun/web-resume
cd web-resume
yarn
```

#### Command

- 预览: `yarn dev` (`http://localhost:3000/`)
- 构建: `yarn build`

#### Custom

##### Resume

自定义 `src/assets/resume/local.resume.yml` 的简历文件，支持热加载。

> 本地热加载页面，请进入 `http://localhost:3000/local`
> 使用 VSCode 还可以有本地 YAML 格式校验哦～

##### Google Analytics

修改 id。

```ts
// src/modules/gtag.ts
app.use(VueGtag, {
  property: { id: 'G-W022WEV65N' },
})
```

### Print

使用 Chrome 右键打印，选择另存为 PDF。

> 可自定义缩放比例，测试 78% 左右（自己试试咯）可以一页输出。

## Ref

整体样式布局，参考自 LaTeX 简历模版 [billryan/resume](https://github.com/billryan/resume/tree/zh_CN)。

## Todo

- [ ] 中英文使用手册
