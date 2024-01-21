import{I as a,o as s,c as t,J as e}from"./index-uJmXFIdQ.js";import"./yamlWorker-GwWK57_1.js";import"./monaco-uRrWI2WM.js";const o={class:"markdown-body max-w-900px m-auto text-left px-4"},p=e(`<div class="text-center"><h3>About</h3></div><blockquote><p>Web 端可打印为 PDF 的简历</p></blockquote><ul><li>使用 YAML 编写</li></ul><pre class="language-yaml"><code class="language-yaml"><span class="token key atrule">id</span><span class="token punctuation">:</span> 云游君
<span class="token key atrule">name</span><span class="token punctuation">:</span> 云游君
<span class="token key atrule">info</span><span class="token punctuation">:</span>
  <span class="token key atrule">avatar</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//yunyoujun.cn/images/avatar.jpg
  <span class="token key atrule">bio</span><span class="token punctuation">:</span> All at sea.

<span class="token key atrule">contact</span><span class="token punctuation">:</span>
  <span class="token key atrule">email</span><span class="token punctuation">:</span>
    <span class="token key atrule">href</span><span class="token punctuation">:</span> mailto<span class="token punctuation">:</span>me@yunyoujun.cn
    <span class="token key atrule">icon</span><span class="token punctuation">:</span> ri<span class="token punctuation">:</span>mail<span class="token punctuation">-</span>line
    <span class="token key atrule">label</span><span class="token punctuation">:</span> me@yunyoujun.cn
  <span class="token key atrule">phone</span><span class="token punctuation">:</span>
    <span class="token key atrule">href</span><span class="token punctuation">:</span> tel<span class="token punctuation">:</span>166 xxxx xxxx
    <span class="token key atrule">icon</span><span class="token punctuation">:</span> ri<span class="token punctuation">:</span>smartphone<span class="token punctuation">-</span>line
    <span class="token key atrule">label</span><span class="token punctuation">:</span> 166 xxxx xxxx
  <span class="token key atrule">blog</span><span class="token punctuation">:</span>
    <span class="token key atrule">href</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//www.yunyoujun.cn
    <span class="token key atrule">icon</span><span class="token punctuation">:</span> ri<span class="token punctuation">:</span>earth<span class="token punctuation">-</span>line
    <span class="token key atrule">label</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//yunyoujun.cn
  <span class="token key atrule">github</span><span class="token punctuation">:</span>
    <span class="token key atrule">href</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//github.com/YunYouJun
    <span class="token key atrule">icon</span><span class="token punctuation">:</span> ri<span class="token punctuation">:</span>github<span class="token punctuation">-</span>line
    <span class="token key atrule">label</span><span class="token punctuation">:</span> YunYouJun
</code></pre><ul><li>简洁至上：以 Markdown 为中心编写简历，基于 YAML 数据配置</li><li>Vue 驱动：使用 Vue 自定义组件</li><li>高性能：为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。</li></ul><h2>如何本地开发（热更新）</h2><blockquote><p>You can use it with hot reload.</p></blockquote><p>Click repo <code>Use this template</code>, or clone this。</p><pre class="language-bash"><code class="language-bash"><span class="token function">git</span> clone https://github.com/YunYouJun/web-resume
<span class="token builtin class-name">cd</span> web-resume
<span class="token function">pnpm</span> i
<span class="token function">pnpm</span> run resume
<span class="token comment"># pnpm run dev</span>
<span class="token comment"># view http://localhost:5173/local</span>
</code></pre><br><h2>快捷键</h2><ul><li><code>Ctrl + P</code> 打印</li></ul><h3><code>/editor</code> 简历编辑器页面</h3><ul><li><code>Esc</code> 退出简历全屏</li></ul><h2>FAQ</h2><ul><li><code>i-xxx</code>: 走 UnoCSS CSS 图标，须添加 <code>safelist</code> 至 <code>unocss.config.ts</code> 中，可静态编译。</li><li><code>xx:yyy</code>: 如 <code>ri:github-line</code>，走 Iconify 图标，使用全局 CDN 动态请求。</li></ul><h2>Other</h2><p>还在不断优化捏！</p>`,18),c=[p],d="About",b=[{property:"og:title",content:"About"},{name:"twitter:title",content:"About"}],x={__name:"about",setup(l,{expose:n}){return n({frontmatter:{title:"About",meta:[{property:"og:title",content:"About"},{name:"twitter:title",content:"About"}]}}),a({title:"About",meta:[{property:"og:title",content:"About"},{name:"twitter:title",content:"About"}]}),(k,r)=>(s(),t("div",o,c))}};export{x as default,b as meta,d as title};
