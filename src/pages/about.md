---
title: About
---

<div class="text-center">
  <!-- You can use Vue components inside markdown -->
  <h3>About</h3>
</div>

> Web 端可打印为 PDF 的简历

- 使用 YAML 编写

```yaml
id: 云游君
name: 云游君
info:
  avatar: https://yunyoujun.cn/images/avatar.jpg
  bio: All at sea.

contact:
  email:
    href: mailto:me@yunyoujun.cn
    icon: ri:mail-line
    label: me@yunyoujun.cn
  phone:
    href: tel:166 xxxx xxxx
    icon: ri:smartphone-line
    label: 166 xxxx xxxx
  blog:
    href: https://www.yunyoujun.cn
    icon: ri:earth-line
    label: https://yunyoujun.cn
  github:
    href: https://github.com/YunYouJun
    icon: ri:github-line
    label: YunYouJun
```

- 简洁至上：以 Markdown 为中心编写简历，基于 YAML 数据配置
- Vue 驱动：使用 Vue 自定义组件
- 高性能：为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。

## 如何本地开发（热更新）

> You can use it with hot reload.

Click repo `Use this template`, or clone this。

```bash
git clone https://github.com/YunYouJun/web-resume
cd web-resume
pnpm i
pnpm run resume
# pnpm run dev
# view http://localhost:5173/local
```

<br />

## 快捷键

- `Ctrl + P` 打印

### `/editor` 简历编辑器页面

- `Esc` 退出简历全屏

## FAQ

- `i-xxx`: 走 UnoCSS CSS 图标，须添加 `safelist` 至 `unocss.config.ts` 中，可静态编译。
- `xx:yyy`: 如 `ri:github-line`，走 Iconify 图标，使用全局 CDN 动态请求。

## Other

还在不断优化捏！
