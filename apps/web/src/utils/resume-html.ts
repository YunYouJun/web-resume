/** Export the already-sanitized resume and its styles without the application runtime. */
export function createResumeHtml(resume: HTMLElement, title: string) {
  const output = document.implementation.createHTMLDocument(title)
  output.documentElement.lang = document.documentElement.lang || 'zh-CN'
  const charset = output.createElement('meta')
  charset.setAttribute('charset', 'utf-8')
  output.head.prepend(charset)
  const viewport = output.createElement('meta')
  viewport.name = 'viewport'
  viewport.content = 'width=device-width, initial-scale=1'
  output.head.append(viewport)
  const policy = output.createElement('meta')
  policy.httpEquiv = 'Content-Security-Policy'
  policy.content = 'script-src \'none\'; object-src \'none\'; base-uri \'none\''
  output.head.append(policy)

  const css = Array.from(document.styleSheets, sheet => Array.from(sheet.cssRules, rule => rule.cssText).join('\n').replace(/url\((['"]?)([^)'"\s]+)\1\)/g, (_match, _quote, url: string) => `url(${JSON.stringify(new URL(url, sheet.href || document.baseURI).href)})`)).join('\n')
  const style = output.createElement('style')
  style.textContent = `${css}\nhtml, body { margin: 0; padding: 0; background: white; color: black; }\nbody > .resume { margin: 0 auto; min-width: 0; width: 100%; max-width: 210mm; box-shadow: none; }\n@media print { body > .resume { max-width: none; } }`
  // HTML raw-text elements must not contain a closing tag from user content.
  style.textContent = style.textContent.replace(/<\/style/gi, '<\\/style')
  output.head.append(style)

  const clone = resume.cloneNode(true) as HTMLElement
  clone.classList.remove('min-w-500px')
  clone.querySelectorAll('.resume-section__controls, button, script, iframe, object, embed').forEach(node => node.remove())
  for (const element of [clone, ...clone.querySelectorAll('*')]) {
    for (const attribute of Array.from(element.attributes)) {
      if (/^on/i.test(attribute.name) || ['contenteditable', 'draggable', 'tabindex'].includes(attribute.name))
        element.removeAttribute(attribute.name)
    }
    for (const attribute of ['src', 'href']) {
      const value = element.getAttribute(attribute)
      if (value && !value.startsWith('#'))
        element.setAttribute(attribute, new URL(value, document.baseURI).href)
    }
  }
  output.body.append(clone)
  return `<!DOCTYPE html>\n${output.documentElement.outerHTML}`
}
