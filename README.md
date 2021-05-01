# Web-Resume

[![GitHub Pages](https://github.com/YunYouJun/web-resume/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/YunYouJun/web-resume/actions/workflows/gh-pages.yml)

[Vite](https://vitejs.dev/) + [Vue3](https://github.com/vuejs/vue-next/) + [sass](https://sass-lang.com/) + [iconify](https://github.com/iconify) + [YAML](https://yaml.org/) + [Chrome](https://www.google.com/chrome/)

## Feature

- 在 Web 端显示你的简历
- 可以被打印成 A4 PDF
- 通过 yml 配置你的简历内容
  - 理论上可以任意换肤，但是抱歉目前还只有这一种 hhh
  - 在线解析
  - yaml 验证，提供字段验证和类型提示（你可能需要安装 [vscode-yaml](https://github.com/redhat-developer/vscode-yaml) 插件）
- PWA
- 自由使用 Web 图标

## Usage

点击仓库右上角 `Use this template`，或 clone 本项目。

```bash
git clone https://github.com/YunYouJun/web-resume
cd web-resume
yarn
```

### Preview

预览

```sh
yarn dev
# http://localhost:3000/
```

### Build

```sh
yarn build
```

### Custom

#### Resume

自定义 `public/resume/*.resume.yml` 的简历文件。

- 图标可参见 [icones](https://icones.js.org/) 使用

#### Google Analytics

修改 id。

```ts
// src/main.ts
app.use(VueGtag, {
  property: { id: 'G-W022WEV65N' },
})
```

### Print

使用 Chrome 右键打印，选择另存为 PDF。

> 可自定义缩放比例，测试 78% 左右可以一页输出。

## FAQ

### Hot reload

- 使用 `import resume from '~/assets/resume/2021.resume.yml'` 的方式导入以支持热加载
- 线上加载 yml 不支持热加载

## Ref

整体样式布局，参考自 LaTeX 简历模版 [billryan/resume](https://github.com/billryan/resume/tree/zh_CN)。

## Todo

- [ ] 中英文使用手册
- [ ] 在线编辑
