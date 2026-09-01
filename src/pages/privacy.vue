<script lang="ts" setup>
const { locale } = useI18n()
const isZh = computed(() => locale.value.startsWith('zh'))

useHead({
  title: 'Privacy Policy · Web Resume',
  meta: [{
    name: 'description',
    content: 'How Web Resume processes resume content, local profile data, analytics, and external requests.',
  }],
})
</script>

<template>
  <InfoPageShell
    v-if="isZh"
    kicker="Privacy"
    title="隐私政策"
    intro="Web Resume 以本地处理为主。我们只处理提供简历预览、编辑和导出所需的数据，并尽量让数据去向保持清晰。"
    updated="更新日期：2026 年 9 月 1 日"
  >
    <section>
      <h2>我们处理哪些数据</h2>
      <ul>
        <li><strong>简历内容：</strong>你输入的 YAML 地址及其返回内容会在浏览器中获取、校验和渲染。</li>
        <li><strong>本地资料：</strong>姓名、电话、邮箱、编辑器内容、当前与最近使用的简历、界面设置保存在浏览器本地存储中。</li>
        <li><strong>基础使用数据：</strong>站点通过 Google Tag Manager 加载站点所有者配置的统计工具，用于了解页面使用情况和改进产品。</li>
      </ul>
    </section>

    <section>
      <h2>数据如何流转</h2>
      <p>Web Resume 当前不提供账号和云端简历存储，也不会把本地资料上传到 Web Resume 自有后端。清除该站点的浏览器数据即可删除本地保存内容。</p>
      <p>当你加载外部 YAML、引用 GitHub 项目信息或打开外部链接时，相应服务会收到正常网络请求，包括 IP 地址、浏览器信息和所请求的网址。它们会依照各自的隐私政策处理数据。</p>
    </section>

    <section>
      <h2>分享与导出</h2>
      <p>分享链接会包含简历 YAML 地址。请勿分享包含访问令牌、临时凭据或不希望公开的地址。PDF 导出由浏览器或操作系统的打印能力完成，生成文件不会经过 Web Resume 服务器。</p>
    </section>

    <section>
      <h2>第三方服务</h2>
      <ul>
        <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google 隐私政策</a>：标签管理及可能由标签加载的使用统计。</li>
        <li><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub 隐私声明</a>：源码托管、问题反馈及可选的公开仓库信息请求。</li>
        <li>你主动提供的简历托管服务：用于返回 YAML 和其中引用的图片等资源。</li>
      </ul>
    </section>

    <section>
      <h2>安全与选择</h2>
      <p>敏感简历应托管在你信任的访问控制之后，并在分享和导出前检查最终内容。你可以关闭“使用我的资料覆盖简历信息”，或通过浏览器设置删除本站本地数据。</p>
    </section>

    <section>
      <h2>联系我们</h2>
      <p>如对隐私或数据处理有疑问，请发送邮件至 <a href="mailto:me@yunyoujun.cn">me@yunyoujun.cn</a>，或通过 GitHub Issues 联系我们。</p>
    </section>
  </InfoPageShell>

  <InfoPageShell
    v-else
    kicker="Privacy"
    title="Privacy policy"
    intro="Web Resume is local-first. We process only the data needed to preview, edit, and export resumes, and aim to keep every data flow understandable."
    updated="Last updated: September 1, 2026"
  >
    <section>
      <h2>Data we process</h2>
      <ul>
        <li><strong>Resume content:</strong> the YAML URL you enter and its response are fetched, validated, and rendered in your browser.</li>
        <li><strong>Local profile data:</strong> your name, phone, email, editor content, current and recent resumes, and interface settings are kept in browser storage.</li>
        <li><strong>Basic usage data:</strong> Google Tag Manager loads analytics selected by the site owner to understand usage and improve the product.</li>
      </ul>
    </section>

    <section>
      <h2>How data moves</h2>
      <p>Web Resume currently has no account or cloud resume storage and does not upload local profile data to a Web Resume backend. Clearing this site's browser data removes locally stored content.</p>
      <p>External YAML hosts, GitHub, and links you open receive ordinary network request data such as your IP address, browser information, and requested URL. Their own privacy policies apply.</p>
    </section>

    <section>
      <h2>Sharing and exporting</h2>
      <p>A share link contains the resume YAML URL. Do not share URLs containing access tokens, temporary credentials, or private locations. Your browser or operating system creates the exported PDF; it is not sent through a Web Resume server.</p>
    </section>

    <section>
      <h2>Third-party services</h2>
      <ul>
        <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Privacy Policy</a>: tag management and any configured usage analytics.</li>
        <li><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub Privacy Statement</a>: source hosting, issue support, and optional public repository data.</li>
        <li>Your chosen resume host: delivery of YAML, images, and other referenced resources.</li>
      </ul>
    </section>

    <section>
      <h2>Security and your choices</h2>
      <p>Host sensitive resumes behind access controls you trust and review the final output before sharing or exporting. You can disable profile overrides or remove local data in your browser settings.</p>
    </section>

    <section>
      <h2>Contact</h2>
      <p>For privacy questions, email <a href="mailto:me@yunyoujun.cn">me@yunyoujun.cn</a> or contact us through GitHub Issues.</p>
    </section>
  </InfoPageShell>
</template>
