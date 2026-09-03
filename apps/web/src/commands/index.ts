import type { ComputedRef } from 'vue'
import type { ResumeCommand, ResumeCommandId } from './types'
import type { ResumeItem } from '~/types'

import * as yaml from 'js-yaml'
import { resumeTemplates } from '~/data/resume-catalog'
import { resumeExamples } from '~/utils'
import { createPortableJsonResume } from '~/utils/resume-format'
import pkg from '../../package.json'

export * from './types'

export interface ResumeCommands {
  commands: ComputedRef<ResumeCommand[]>
  execute: (id: ResumeCommandId) => Promise<boolean>
  find: (id: ResumeCommandId) => ResumeCommand | undefined
}

export function useResumeCommands(): ResumeCommands {
  const app = useAppStore()
  const editor = useEditorStore()
  const user = useUserStore()
  const router = useRouter()
  const route = useRoute()
  const { availableLocales, locale, t } = useI18n()

  function openExternal(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function isYunLeFunAppBrowser() {
    return window.ylf?.inYunleApp === true
  }

  async function exportResume() {
    if (isYunLeFunAppBrowser()) {
      let copied = false
      try {
        await navigator.clipboard.writeText(window.location.href)
        copied = true
      }
      catch {
        // Clipboard access may be unavailable in older host versions. The
        // native title-bar menu still provides the system-browser action.
      }

      app.showToast({
        description: t(copied
          ? 'toast.in_app_print_copied_description'
          : 'toast.in_app_print_description'),
        title: t('toast.in_app_print_title'),
      })
      return
    }

    if (!app.hasSeenPrintGuide) {
      app.hasSeenPrintGuide = true
      app.showToast({
        description: t('toast.print_guide_description'),
        title: t('toast.print_guide_title'),
      })
      window.setTimeout(() => window.print(), 650)
    }
    else {
      window.print()
    }
  }

  function exportPortableResume() {
    const resumeDocument = createPortableJsonResume(yaml.load(editor.resumeText))
    const blob = new Blob([`${JSON.stringify(resumeDocument, null, 2)}\n`], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const name = resumeDocument.basics?.name?.trim().replace(/[^\p{L}\p{N}]+/gu, '-') || 'resume'
    const link = document.createElement('a')
    link.download = `${name}.resume.json`
    link.href = href
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(href), 0)
    app.showToast({ title: t('toast.portable_exported') })
  }

  function toggleLocale() {
    const locales = availableLocales
    locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
  }

  async function loadResume(resume: ResumeItem) {
    const loaded = await editor.goToResume(resume)
    if (loaded) {
      app.resumeSourceOpen = false
      await router.push('/')
    }
  }

  const commands = computed<ResumeCommand[]>(() => {
    const fixedCommands: ResumeCommand[] = [
      {
        enabled: true,
        group: 'help',
        icon: 'i-ri-search-line',
        id: 'app.commands',
        keywords: ['command', 'palette', 'search', '命令', '搜索'],
        label: t('command.open_commands'),
        palette: false,
        shortcut: 'Mod+Shift+P',
        run: () => {
          app.commandPaletteOpen = true
        },
      },
      {
        enabled: true,
        group: 'start',
        icon: 'i-ri-link',
        id: 'resume.load',
        keywords: ['url', 'yaml', 'open', '加载', '地址'],
        label: t('command.load_resume'),
        menu: 'file',
        run: () => {
          app.resumeSourceOpen = true
        },
      },
      {
        enabled: Boolean(app.curResume.url),
        group: 'view',
        icon: 'i-ri-slideshow-4-line',
        id: 'resume.preview',
        keywords: ['preview', 'resume', '预览', '纯净'],
        label: t('command.preview_resume'),
        menu: 'view',
        run: () => openExternal(app.copiedResumeUrl),
      },
      {
        enabled: Boolean(editor.resumeJson),
        group: 'output',
        icon: 'i-ri-printer-line',
        id: 'resume.print',
        keywords: ['pdf', 'print', 'save', '打印', '导出'],
        label: t('command.export_pdf'),
        menu: 'file',
        shortcut: 'Mod+P',
        run: exportResume,
      },
      {
        description: editor.resumeFormat === 'legacy' ? t('command.convert_before_portable') : undefined,
        enabled: editor.resumeFormat === 'json-resume' && editor.resumeValidationErrors.length === 0,
        group: 'output',
        icon: 'i-ri-file-code-line',
        id: 'resume.export-portable',
        keywords: ['json', 'resume', 'portable', 'download', '标准', '导出'],
        label: t('command.export_portable'),
        menu: 'file',
        run: exportPortableResume,
      },
      {
        enabled: Boolean(app.curResume.url),
        group: 'output',
        icon: 'i-ri-share-forward-line',
        id: 'resume.share',
        keywords: ['copy', 'share', 'link', '复制', '分享'],
        label: t('command.copy_share_link'),
        menu: 'file',
        run: async () => {
          await navigator.clipboard.writeText(app.copiedResumeUrl)
          app.showToast({ title: t('toast.link_copied') })
        },
      },
      {
        enabled: true,
        group: 'start',
        icon: 'i-ri-eraser-line',
        id: 'resume.restore-example',
        keywords: ['reset', 'restore', 'example', '恢复', '示例'],
        label: t('command.restore_example'),
        menu: 'file',
        run: async () => {
          app.restoreSnapshot = {
            baseline: editor.loadedResumeText,
            resume: { ...app.curResume },
            text: editor.resumeText,
          }
          if (await editor.reset()) {
            app.showToast({
              actionCommandId: 'resume.undo-restore',
              actionLabel: t('command.undo'),
              title: t('toast.example_restored'),
            })
          }
        },
      },
      {
        enabled: Boolean(app.restoreSnapshot),
        group: 'start',
        icon: 'i-ri-arrow-go-back-line',
        id: 'resume.undo-restore',
        keywords: ['undo', 'restore', '撤销'],
        label: t('command.undo_restore'),
        palette: false,
        run: () => {
          if (!app.restoreSnapshot)
            return
          app.curResume = { ...app.restoreSnapshot.resume }
          editor.setResumeText(app.restoreSnapshot.text)
          editor.setResumeBaseline(app.restoreSnapshot.baseline)
          editor.codeEditor?.setValue(app.restoreSnapshot.text)
          app.restoreSnapshot = undefined
          app.showToast({ title: t('toast.restore_undone') })
        },
      },
      {
        checked: user.settings.overrideInfo,
        enabled: true,
        group: 'view',
        icon: user.settings.overrideInfo ? 'i-ri-eye-line' : 'i-ri-eye-off-line',
        id: 'view.override-info',
        keywords: ['profile', 'personal', 'override', '个人资料', '覆盖'],
        label: t('command.override_info'),
        menu: 'view',
        run: () => {
          user.settings.overrideInfo = !user.settings.overrideInfo
        },
      },
      {
        checked: app.isFullscreen,
        description: route.path === '/editor' ? undefined : t('command.editor_only'),
        enabled: route.path === '/editor',
        group: 'view',
        icon: app.isFullscreen ? 'i-ri-fullscreen-exit-line' : 'i-ri-fullscreen-line',
        id: 'view.fullscreen',
        keywords: ['fullscreen', 'editor', '全屏', '编辑器'],
        label: t('command.fullscreen_editor'),
        menu: 'view',
        run: () => app.toggleFullscreen(),
      },
      {
        enabled: route.path !== '/editor',
        group: 'edit',
        icon: 'i-ri-side-bar-line',
        id: 'navigate.editor',
        keywords: ['editor', 'yaml', '编辑器'],
        label: t('command.open_editor'),
        run: async () => {
          await router.push('/editor')
        },
      },
      {
        enabled: true,
        group: 'settings',
        icon: 'i-ri-settings-3-line',
        id: 'navigate.settings',
        keywords: ['settings', 'preferences', 'appearance', '设置', '偏好', '外观'],
        label: t('command.open_settings'),
        menu: 'file',
        shortcut: 'Mod+,',
        run: async () => {
          await router.push('/settings')
        },
      },
      {
        description: route.path === '/editor' ? undefined : t('command.editor_only'),
        enabled: route.path === '/editor' && Boolean(editor.codeEditor),
        group: 'edit',
        icon: 'i-ri-code-s-slash-line',
        id: 'editor.format',
        keywords: ['format', 'yaml', '格式化'],
        label: t('command.format_yaml'),
        run: async () => {
          await editor.codeEditor?.getAction('editor.action.formatDocument')?.run()
        },
      },
      {
        description: route.path === '/editor' ? undefined : t('command.editor_only'),
        enabled: route.path === '/editor' && Boolean(editor.codeEditor),
        group: 'edit',
        icon: 'i-ri-terminal-box-line',
        id: 'editor.commands',
        keywords: ['monaco', 'editor', 'command', '编辑器命令'],
        label: t('command.open_editor_commands'),
        shortcut: 'F1',
        run: () => editor.codeEditor?.trigger('web-resume', 'editor.action.quickCommand', null),
      },
      {
        enabled: true,
        group: 'help',
        icon: 'i-ri-question-line',
        id: 'help.onboarding',
        keywords: ['guide', 'help', 'start', '新手', '引导'],
        label: t('command.open_guide'),
        menu: 'help',
        run: () => {
          app.onboardingOpen = true
        },
      },
      {
        enabled: true,
        group: 'help',
        icon: 'i-ri-book-2-line',
        id: 'help.docs',
        keywords: ['docs', 'documentation', '文档'],
        label: t('command.open_docs'),
        menu: 'help',
        run: () => openExternal(pkg.docs),
      },
      {
        enabled: true,
        group: 'help',
        icon: 'i-ri-customer-service-2-line',
        id: 'help.support',
        keywords: ['support', 'help', 'issue', '反馈', '支持', '问题'],
        label: t('command.open_support'),
        menu: 'help',
        run: async () => {
          await router.push('/support')
        },
      },
      {
        enabled: true,
        group: 'help',
        icon: 'i-ri-shield-check-line',
        id: 'help.privacy',
        keywords: ['privacy', 'data', 'policy', '隐私', '数据'],
        label: t('command.open_privacy'),
        menu: 'help',
        run: async () => {
          await router.push('/privacy')
        },
      },
      {
        enabled: true,
        group: 'help',
        icon: 'i-ri-github-line',
        id: 'help.github',
        keywords: ['github', 'source', '源码'],
        label: 'GitHub',
        menu: 'help',
        run: () => openExternal(pkg.repository.url),
      },
      {
        enabled: true,
        group: 'help',
        icon: 'i-ri-translate',
        id: 'help.language',
        keywords: ['language', 'locale', '语言', '中文', 'english'],
        label: t('command.toggle_language'),
        menu: 'help',
        run: toggleLocale,
      },
    ]

    const exampleCommands: ResumeCommand[] = resumeExamples.map((resume, index) => ({
      enabled: app.curResume.url !== resume.url || !editor.resumeJson,
      group: 'start',
      icon: 'i-ri-file-user-line',
      id: `resume.example:${index}`,
      keywords: ['example', 'sample', '示例', resume.title || '', resume.url],
      label: resume.title || resume.url,
      menu: 'file',
      run: () => loadResume(resume),
      scope: 'resume',
    }))

    const templateCommands: ResumeCommand[] = resumeTemplates.map(template => ({
      checked: app.resumeTemplateId === template.id,
      enabled: true,
      group: 'view',
      icon: template.id === 'sidebar'
        ? 'i-ri-layout-left-2-line'
        : template.id === 'compact'
          ? 'i-ri-layout-row-line'
          : 'i-ri-layout-4-line',
      id: `resume.template:${template.id}`,
      keywords: ['template', 'layout', '模板', '版式', t(template.nameKey), ...template.tagKeys.map(t)],
      label: t('command.use_template_named', { name: t(template.nameKey) }),
      menu: 'view',
      run: async () => {
        app.resumeTemplateId = template.id
        if (route.path === '/') {
          await router.replace({
            query: {
              ...route.query,
              template: template.id,
            },
          })
        }
      },
      scope: 'template',
    }))

    const exampleUrls = new Set(resumeExamples.map(resume => resume.url))
    const recentResumeCommands: ResumeCommand[] = app.usedResumes
      .filter(resume => resume.url && !exampleUrls.has(resume.url))
      .slice(-5)
      .reverse()
      .map(resume => ({
        enabled: app.curResume.url !== resume.url,
        group: 'start',
        icon: 'i-ri-history-line',
        id: `resume.recent:${encodeURIComponent(resume.url)}`,
        keywords: ['recent', 'history', '最近', resume.title || '', resume.url],
        label: resume.title || resume.url,
        menu: 'file',
        run: () => loadResume(resume),
        scope: 'resume',
      }))

    return [...fixedCommands, ...templateCommands, ...recentResumeCommands, ...exampleCommands]
  })

  function find(id: ResumeCommandId) {
    return commands.value.find(command => command.id === id)
  }

  async function execute(id: ResumeCommandId) {
    const command = find(id)
    if (!command?.enabled)
      return false

    app.commandPaletteOpen = false
    await command.run()
    if (command.palette !== false)
      app.recordCommand(command.id)
    return true
  }

  return {
    commands,
    execute,
    find,
  }
}
