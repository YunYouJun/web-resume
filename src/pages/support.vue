<script lang="ts" setup>
import pkg from '~/../package.json'

const { locale } = useI18n()
const isZh = computed(() => locale.value.startsWith('zh'))
const issueUrl = `${pkg.repository.url}/issues`

useHead({
  title: 'Help and Support · Web Resume',
  meta: [{
    name: 'description',
    content: 'Get help loading YAML resumes, exporting PDFs, using the editor, and reporting Web Resume issues.',
  }],
})
</script>

<template>
  <InfoPageShell
    v-if="isZh"
    kicker="Support"
    title="帮助与支持"
    intro="从加载 YAML 到导出 PDF，这里汇总最常见的操作和故障排查入口。"
    updated="适用于 Web Resume 0.3"
  >
    <section class="info-page__callout">
      <h2>快速开始</h2>
      <ol>
        <li>选择“加载简历”，粘贴可访问的 YAML 地址，或先试用内置示例。</li>
        <li>进入编辑器调整内容，并在简历页检查最终排版。</li>
        <li>选择“导出 PDF”，在浏览器打印窗口中使用“另存为 PDF”。</li>
      </ol>
    </section>

    <section>
      <h2>简历无法加载</h2>
      <ul>
        <li>确认地址使用 HTTPS，并且直接返回 YAML，而不是登录页或 HTML 错误页。</li>
        <li>确认托管服务允许浏览器跨域读取（CORS）。</li>
        <li>打开“加载简历”面板查看具体 HTTP 状态或格式错误。</li>
        <li>受 Cloudflare Access 保护的地址可使用仓库 CLI 和服务令牌导出；不要把令牌写进分享链接。</li>
      </ul>
    </section>

    <section>
      <h2>移动端与云乐坊 App 导出</h2>
      <p>手机端仍使用系统打印能力。在云乐坊 App 内选择导出时，Web Resume 会复制当前链接并提示你从右上角“更多”选择“系统浏览器打开”，然后再次导出。</p>
    </section>

    <section>
      <h2>提交问题</h2>
      <p>报告问题时请附上浏览器与系统版本、复现步骤、错误提示和不包含敏感信息的示例 YAML 地址。不要在公开 Issue 中粘贴真实电话、邮箱、访问令牌或私人简历内容。</p>
      <div class="info-page__actions">
        <a :href="issueUrl" target="_blank" rel="noopener">GitHub Issues</a>
        <a href="mailto:me@yunyoujun.cn">邮件联系</a>
      </div>
    </section>
  </InfoPageShell>

  <InfoPageShell
    v-else
    kicker="Support"
    title="Help and support"
    intro="Find the common paths from loading YAML to exporting a PDF, plus practical troubleshooting steps."
    updated="For Web Resume 0.3"
  >
    <section class="info-page__callout">
      <h2>Quick start</h2>
      <ol>
        <li>Choose Load resume and paste an accessible YAML URL, or start with an example.</li>
        <li>Edit the YAML in the editor and review the final layout on the resume page.</li>
        <li>Choose Export PDF and select Save as PDF in your browser print dialog.</li>
      </ol>
    </section>

    <section>
      <h2>The resume does not load</h2>
      <ul>
        <li>Use HTTPS and make sure the URL returns YAML directly, not a login page or an HTML error.</li>
        <li>Make sure the host allows cross-origin browser requests (CORS).</li>
        <li>Open the Load resume panel to see the HTTP status or format error.</li>
        <li>For Cloudflare Access-protected URLs, use the repository CLI with a service token. Never put tokens in share links.</li>
      </ul>
    </section>

    <section>
      <h2>Exporting on mobile and in YunLeFun</h2>
      <p>Mobile export uses the operating system print flow. In the YunLeFun app, Web Resume copies the current link and asks you to choose Open in system browser from the top-right More menu before exporting again.</p>
    </section>

    <section>
      <h2>Report a problem</h2>
      <p>Include your browser and OS versions, reproduction steps, the error message, and a non-sensitive example YAML URL. Never post real contact details, access tokens, or private resume content in a public issue.</p>
      <div class="info-page__actions">
        <a :href="issueUrl" target="_blank" rel="noopener">GitHub Issues</a>
        <a href="mailto:me@yunyoujun.cn">Email support</a>
      </div>
    </section>
  </InfoPageShell>
</template>
