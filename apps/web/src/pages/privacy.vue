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
    updated="更新日期：2026 年 9 月 3 日"
  >
    <section>
      <h2>我们处理哪些数据</h2>
      <ul>
        <li><strong>简历内容：</strong>你输入的 YAML 地址及其返回内容会在浏览器中获取、校验和渲染。</li>
        <li><strong>本地资料：</strong>姓名、电话、邮箱、编辑器内容、当前与最近使用的简历、界面设置保存在浏览器本地存储中。姓名、电话、邮箱等本地覆盖字段不会随云同步上传。</li>
        <li><strong>可选账号与云同步：</strong>登录云乐坊账号后，简历原始 YAML、文件名、模板、校验状态、版本和保存时间会保存在你的云乐坊云盘空间；会话使用安全 Cookie 维持。</li>
        <li><strong>基础使用数据：</strong>站点通过 Google Tag Manager 加载站点所有者配置的统计工具，用于了解页面使用情况和改进产品。</li>
      </ul>
    </section>

    <section>
      <h2>数据如何流转</h2>
      <p>不登录也可以完整使用本地编辑与导出。只有你登录并首次为当前简历命名保存后，Web Resume 才会把简历 YAML 同步到云盘；随后会在停止输入约 2 秒后自动保存。并发版本冲突会生成副本，不会静默覆盖。</p>
      <p>退出登录不会删除本机内容。云端删除先进入回收站并保留 30 天；“清除本机数据”只清除当前浏览器中的 Web Resume 数据，不删除云端简历。</p>
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
        <li><a href="https://www.yunle.fun" target="_blank" rel="noopener">云乐坊账号与云盘</a>：可选的统一登录、私有简历存储和共享账号空间配额。</li>
        <li>你主动提供的简历托管服务：用于返回 YAML 和其中引用的图片等资源。</li>
      </ul>
    </section>

    <section>
      <h2>安全与选择</h2>
      <p>外部简历中的富文本和动态链接会在渲染前经过安全清洗。云端简历为私有标准存储，不提供公开链接，也不提供端到端加密；请勿保存密钥、令牌等机密。你可以关闭“使用我的资料覆盖简历信息”，退出账号，或单独清除本机数据。</p>
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
    updated="Last updated: September 3, 2026"
  >
    <section>
      <h2>Data we process</h2>
      <ul>
        <li><strong>Resume content:</strong> the YAML URL you enter and its response are fetched, validated, and rendered in your browser.</li>
        <li><strong>Local profile data:</strong> your name, phone, email, editor content, current and recent resumes, and interface settings are kept in browser storage. Local name, phone, and email overrides are never uploaded by cloud sync.</li>
        <li><strong>Optional account and cloud sync:</strong> after you sign in with YunLeFun, the original resume YAML plus its name, template, validation status, version, and save times are stored in your YunLeFun Drive space. A secure cookie maintains the app session.</li>
        <li><strong>Basic usage data:</strong> Google Tag Manager loads analytics selected by the site owner to understand usage and improve the product.</li>
      </ul>
    </section>

    <section>
      <h2>How data moves</h2>
      <p>Local editing and export remain fully available without signing in. Web Resume uploads YAML only after you sign in and explicitly name the resume for its first cloud save. Later edits are saved about two seconds after typing stops. Concurrent version conflicts create a copy instead of silently overwriting data.</p>
      <p>Signing out keeps local content. Cloud deletion moves a resume to Trash for 30 days. “Clear device data” removes only Web Resume data in the current browser and does not delete cloud resumes.</p>
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
        <li><a href="https://www.yunle.fun" target="_blank" rel="noopener">YunLeFun Account and Drive</a>: optional federated sign-in, private resume storage, and the shared account storage quota.</li>
        <li>Your chosen resume host: delivery of YAML, images, and other referenced resources.</li>
      </ul>
    </section>

    <section>
      <h2>Security and your choices</h2>
      <p>Rich text and dynamic links from external resumes are sanitized before rendering. Cloud resumes use private standard storage, with no public links or end-to-end encryption; do not store secrets or access tokens. You can disable profile overrides, sign out, or clear this device's local data separately.</p>
    </section>

    <section>
      <h2>Contact</h2>
      <p>For privacy questions, email <a href="mailto:me@yunyoujun.cn">me@yunyoujun.cn</a> or contact us through GitHub Issues.</p>
    </section>
  </InfoPageShell>
</template>
