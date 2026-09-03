import { defineConfig } from 'vitepress'

const repositoryUrl = 'https://github.com/YunYouJun/web-resume'

export default defineConfig({
  title: 'Web Resume',
  description: 'Create, edit, publish, and export a resume from YAML or JSON Resume data.',
  base: '/docs/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/docs/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'YunYouJun' }],
    ['meta', { property: 'og:title', content: 'Web Resume Documentation' }],
    ['meta', { property: 'og:description', content: 'Create, edit, publish, and export a resume from YAML or JSON Resume data.' }],
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/' },
          { text: 'Migration', link: '/migrations/v0.4-json-resume' },
          { text: 'Web Resume', link: 'https://resume.yunle.fun' },
        ],
        sidebar: {
          '/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'User Guide', link: '/guide/' },
              ],
            },
          ],
          '/migrations/': [
            {
              text: 'Migration',
              items: [
                { text: 'JSON Resume in v0.4', link: '/migrations/v0.4-json-resume' },
              ],
            },
          ],
          '/reference/': [
            {
              text: 'Reference',
              items: [
                { text: 'Data contract for v1', link: '/reference/data-contract-v1' },
              ],
            },
          ],
        },
        outline: { level: [2, 3], label: 'On this page' },
        editLink: {
          pattern: `${repositoryUrl}/edit/main/docs/:path`,
          text: 'Edit this page on GitHub',
        },
        lastUpdated: { text: 'Last updated' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © YunYouJun',
        },
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'Web Resume 文档',
      description: '使用 YAML 或 JSON Resume 创建、编辑、发布和导出简历。',
      themeConfig: {
        nav: [
          { text: '使用指南', link: '/zh/guide/' },
          { text: '迁移', link: '/zh/migrations/v0.4-json-resume' },
          { text: 'Web Resume', link: 'https://resume.yunle.fun' },
        ],
        sidebar: {
          '/zh/': [
            {
              text: '指南',
              items: [
                { text: '使用手册', link: '/zh/guide/' },
              ],
            },
            {
              text: '参考',
              items: [
                { text: 'v0.4 JSON Resume 迁移', link: '/zh/migrations/v0.4-json-resume' },
                { text: 'JSON Resume 兼容性评估', link: '/zh/reference/json-resume-compatibility' },
                { text: 'v1 数据契约', link: '/zh/reference/data-contract-v1' },
              ],
            },
          ],
        },
        outline: { level: [2, 3], label: '本页目录' },
        editLink: {
          pattern: `${repositoryUrl}/edit/main/docs/:path`,
          text: '在 GitHub 上编辑此页',
        },
        lastUpdated: { text: '最后更新于' },
        docFooter: { prev: '上一页', next: '下一页' },
        darkModeSwitchLabel: '外观',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        langMenuLabel: '切换语言',
        notFound: {
          title: '页面未找到',
          quote: '你访问的页面不存在或已被移动。',
          linkLabel: '返回中文首页',
          linkText: '返回首页',
        },
        footer: {
          message: '基于 MIT 许可证发布。',
          copyright: '版权所有 © YunYouJun',
        },
      },
    },
  },

  themeConfig: {
    logo: '/favicon.svg',
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: repositoryUrl },
    ],
  },
})
