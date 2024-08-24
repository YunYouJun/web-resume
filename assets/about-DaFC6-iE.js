import{I as a,o as s,c as t,J as e}from"./index-yVLxA3OL.js";import"./yamlWorker-DH8lLEd7.js";import"./monaco-IzPWInhl.js";const o={class:"markdown-body max-w-900px m-auto text-left px-4"},p=e(`<div class="text-center"><h3>About</h3></div><blockquote><p>Web 端可打印为 PDF 的简历</p></blockquote><h2>使用</h2><h3>在线使用</h3><p>切换至 <a href="/editor" target="_blank" rel="noopener">编辑器</a> 页面，即可通过编写 YAML 在线编辑简历。</p><pre class="language-yaml"><code class="language-yaml"><span class="token key atrule">id</span><span class="token punctuation">:</span> 云游君
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
</code></pre><ul><li>简洁至上：以 Markdown 为中心编写简历，基于 YAML 数据配置。</li><li>自定义：你仍然可以使用 Vue 自定义各个组件的样式。</li><li>便捷：随时随地在线预览编辑，并打印 PDF。</li></ul><h3>本地开发（热更新）</h3><blockquote><p>You can use it with hot reload.</p></blockquote><p>Click repo <code>Use this template</code>, or clone this。</p><pre class="language-bash"><code class="language-bash"><span class="token function">git</span> clone https://github.com/YunYouJun/web-resume
<span class="token builtin class-name">cd</span> web-resume
<span class="token function">pnpm</span> i
<span class="token function">pnpm</span> run resume
<span class="token comment"># pnpm run dev</span>
<span class="token comment"># view http://localhost:5173/local</span>
</code></pre><br><h2>快捷键</h2><ul><li><code>Ctrl + P</code> 打印</li></ul><h3><code>/editor</code> 简历编辑器页面</h3><ul><li><code>Esc</code> 退出简历全屏</li></ul><h2>FAQ</h2><ul><li><code>i-xxx</code>: 使用 UnoCSS CSS 图标，须添加 <code>safelist</code> 至 <code>unocss.config.ts</code> 中，可静态编译。</li><li><code>xx:yyy</code>: 如 <code>ri:github-line</code>，Iconify 在线图标，使用全局 CDN 动态请求。</li></ul><h2>Other</h2><p>还在不断优化捏！</p>`,20),c=[p],y="About",b=[{property:"og:title",content:"About"},{name:"twitter:title",content:"About"}],x={__name:"about",setup(l,{expose:n}){return n({frontmatter:{title:"About",meta:[{property:"og:title",content:"About"},{name:"twitter:title",content:"About"}]}}),a({title:"About",meta:[{property:"og:title",content:"About"},{name:"twitter:title",content:"About"}]}),(k,r)=>(s(),t("div",o,c))}};export{x as default,b as meta,y as title};
