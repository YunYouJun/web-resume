# JSON Resume 兼容性评估

> 评估日期：2026-09-02
> 结论：当前 web-resume YAML **不与 JSON Resume 直接兼容**，但可以通过“JSON Resume 标准数据 + `x-web-resume` 展示扩展 + 双向适配器”渐进兼容，无需立即破坏现有简历。

> [!NOTE]
> 本文保留的是实施前的兼容性评估和决策依据。v0.4 已完成格式识别、校验、渲染适配、显式转换和拖拽顺序持久化；当前使用方式与未完成项以[迁移指南](../migrations/v0.4-json-resume.md)为准。

## 评估基准

JSON Resume 在 2026 年将 schema 迁入 `jsonresume/jsonresume.org` monorepo。官方说明 `packages/schema/schema.json` 和 `sample.resume.json` 代表当前稳定规范，包仍以 `@jsonresume/schema` 发布（[Schema README](https://github.com/jsonresume/jsonresume.org/blob/54eba4131801b6b32aa947ce8a4fbef526800a08/packages/schema/README.md)）。本次以该仓库当时 `master` 的 commit `54eba4131801b6b32aa947ce8a4fbef526800a08` 为固定基准：

- 发布包版本是 **1.3.1**（[`package.json`](https://github.com/jsonresume/jsonresume.org/blob/54eba4131801b6b32aa947ce8a4fbef526800a08/packages/schema/package.json)）。
- canonical schema 是 JSON Schema draft-07（[`schema.json`](https://github.com/jsonresume/jsonresume.org/blob/54eba4131801b6b32aa947ce8a4fbef526800a08/packages/schema/schema.json)）。
- 官网展示页仍标注 `version 1.0.0`（[Schema 展示页](https://jsonresume.org/schema)）。因此实现和验证应以发布包/canonical schema 为准，不应仅依赖展示页的版本文字。

canonical schema 的重要行为：

- 根对象及所有嵌套对象均允许 `additionalProperties: true`；扩展字段可通过 schema 验证，但第三方主题不一定识别或保留它们。
- schema 中没有 `required`；所有 section 和字段都可省略。已声明字段不接受 `null`。
- 日期只接受 `YYYY`、`YYYY-MM` 或 `YYYY-MM-DD`。该正则只约束形状，不是严格的真实日历校验。
- 官方尚未采纳专用 `custom` 命名空间；相关提案仍为 open issue（[`custom` field proposal](https://github.com/jsonresume/jsonresume.org/issues/316)）。
- schema 遵循 SemVer，破坏性公共 API 变更只应进入 major 版本（[Versioning](https://github.com/jsonresume/jsonresume.org/blob/54eba4131801b6b32aa947ce8a4fbef526800a08/packages/schema/README.md#versioning)）。

## 当前 web-resume 模型

当前数据契约由 [`apps/web/src/types/resume.ts`](https://github.com/YunYouJun/web-resume/blob/main/apps/web/src/types/resume.ts) 和 [`apps/web/src/types/base.ts`](https://github.com/YunYouJun/web-resume/blob/main/apps/web/src/types/base.ts) 定义，并通过 [`apps/web/scripts/schema.ts`](https://github.com/YunYouJun/web-resume/blob/main/apps/web/scripts/schema.ts) 生成项目自有 schema。主要结构是：

```text
basics:      object
contact:     object<string, { href, icon, label }>
education:   { title, icon, histories[] }
project:     { title, icon, sets[] }
skill:       { title, icon, sets[] }
certificate: { title, icon, histories[] }
other:       { title, icon, info[] }
footer:      { link }
```

渲染器 [`apps/web/src/components/resume/All.vue`](https://github.com/YunYouJun/web-resume/blob/main/apps/web/src/components/resume/All.vue) 依赖 YAML 对象的 key 顺序决定 section 顺序，并仅识别 `education` / `project` / `certificate` / `skill` / `work` / `other`。本次工作已将原本只存在于组件和基础类型中的 `work` 补入 `ResumeInfo` 与生成的项目 schema，消除了这项内部不一致。

项目自有 schema 与官方规范的校验哲学也相反：它将 `basics` / `contact`、联系方式的 `href` / `icon` / `label` 以及多个展示字段设为必填；JSON Resume 则允许不完整简历。

## 字段映射

JSON Resume 的完整标准 section 为 `$schema`、`basics`、`work`、`volunteer`、`education`、`awards`、`certificates`、`publications`、`skills`、`languages`、`interests`、`references`、`projects` 和 `meta`（[canonical schema](https://github.com/jsonresume/jsonresume.org/blob/54eba4131801b6b32aa947ce8a4fbef526800a08/packages/schema/schema.json)）。

| web-resume | JSON Resume | 转换与损失 |
| --- | --- | --- |
| `name` | `basics.name` | 项目根级 `name` 是别名，导出时应合并到 `basics.name`。 |
| `basics.name` | `basics.name` | 直接映射。 |
| `basics.label` | `basics.label` | 直接映射。 |
| `basics.avatar` | `basics.image` | 改名；官方 `image` 只约束为 string。 |
| `basics.bio` | `basics.summary` | 改名。 |
| `basics.location: string` | `basics.location: object` | 不能无损自动拆分为 `address/postalCode/city/countryCode/region`；需要用户确认或作为 `city` 的宽松导入。 |
| `basics.sex/birth/age` | 无标准字段 | 保存到 `x-web-resume.basics`，或在“纯标准导出”中省略。 |
| `contact.email` | `basics.email` | 从 `label` 取值；`href` 的 `mailto:` 可用于交叉校验，`icon` 是展示扩展。 |
| `contact.phone` | `basics.phone` | 从 `label` 取值；`tel:` href 和 icon 作为展示扩展。 |
| `contact.blog` | `basics.url` | 优先取 `href`。 |
| 其他 `contact.*` | `basics.profiles[]` | key → `network`，`label` → `username`，`href` → `url`；任意 contact 不一定都是社交资料，需允许扩展回退。 |
| `education.histories[]` | `education[]` | wrapper 需展平；`school → institution`、`grade → score`、`start/end → startDate/endDate`，`area/studyType` 直接映射。 |
| `education.{title,icon}` | 无标准字段 | 属于 section 展示配置，保存到 `x-web-resume.sections.education`。 |
| `EducationHistory.city/logo/icon` | 无标准字段 | 保存到对应 item 扩展；JSON Resume education 没有 location/logo。 |
| `work.sets[]` | `work[]` | wrapper 需展平；`name` 直接映射，`type → position`、`start/end → startDate/endDate`、`summary/highlights/url` 直接映射。 |
| `project.sets[]` | `projects[]` **或** `work[]` | 当前样例将雇主经历和开源项目混在 `project`，必须先按语义拆分，不能只根据字段名批量迁移。 |
| `ProjectSet.summary` | `work.summary` / `projects.description` | 根据上一行的 section 决定。 |
| `ProjectSet.type` | `work.position` / `projects.type` | `projects.roles[]` 更适合多角色情况。 |
| `ProjectSet.keywords[]` | `projects.keywords[]` | 当前可为 `{ name, icon, logo }` 或 string；标准只接受 string[]，图标需作为扩展保存。 |
| `ProjectSet.repo/logo/open/badges` | 无直接标准字段 | `repo` 可在没有 `url` 时降级为 `url`；其余保存到 item 扩展。 |
| `skill.sets[]` | `skills[]` | wrapper 需展平；`title → name`，keyword object 只导出 `name` 得到 string[]。当前没有对应 `level`。 |
| `certificate.histories[]` | `awards[]` / `certificates[]` / `publications[]` | 当前“奖项表彰”样例混有获奖、认证和论文；需按语义拆分。`name/place/time` 可分别映射为 title/awarder/date 或 name/issuer/date。 |
| `other.info[]` | 无等价 section | 不应无条件映射到 `interests`；可保存在 `x-web-resume.other`。 |
| `footer.link` | `meta.canonical` 或扩展 | 只有当 link 确实指向该简历最新版本时才能映射为 `meta.canonical`。 |

当前完全缺少对 `volunteer`、`languages`、`interests`、`references` 和 `meta` 的渲染；`awards`、`certificates`、`publications`、`projects`、`skills` 也不会以官方 section 名被当前渲染器识别。

## 兼容性判定

| 维度 | 现状 | 原因 |
| --- | --- | --- |
| canonical schema 验证 | 不兼容 | 官方 `education` 必须是 array，项目中是 object；多个公开样例还将 `basics.location` 写为 string，官方要求 object。 |
| 标准字段语义 | 部分兼容 | `basics.name/label`、部分 project/work/education item 字段可映射，但 wrapper、命名和 section 语义不同。 |
| 第三方 JSON Resume 导入 | 不兼容 | 当前 schema 强制 `contact`，渲染器不识别标准复数 section 名。 |
| web-resume 导出到第三方 | 不兼容 | 当前无标准化导出边界，并且日期常为“2019 年 9 月”、“至今”等非规范字符串。 |
| 扩展可行性 | 可行 | canonical schema 允许 additional properties，可保留 web-resume 的 title/icon/logo/order 等展示信息。 |

使用 canonical schema 对当前 [`local.resume.yml`](https://github.com/YunYouJun/web-resume/blob/main/apps/web/src/assets/resume/local.resume.yml) 进行结构验证（忽略 URI/email format 插件）时，至少会在 `/education` 产生 `must be array`。其他如 `contact` / `project` / `skill` 能被放行只是因为 `additionalProperties: true`，不代表 JSON Resume 主题会理解这些自定义 section。

## 推荐兼容策略

### 1. 以 canonical model 作为新文档结构

项目已采用独立的 `JsonResume` 类型和验证器，以 `@jsonresume/schema@~1.3.0` 为契约。为避免过早引入第三套领域对象，v0.4 暂不增加独立的 `NormalizedResume`：标准文档直接使用 JSON Resume 结构，legacy 文档通过读取适配器转换为现有渲染结构。渲染所需的 section title/icon、item logo 和展开状态统一进入 `x-web-resume`。

```text
legacy YAML ---- legacy adapter ----\
                                  > existing renderer
JSON Resume ---- render adapter --/

legacy YAML ---- explicit conversion ---- JSON Resume + x-web-resume
```

格式检测、官方校验、转换 warning 与两个适配方向集中在同一深模块中，渲染组件不包含格式分支。若未来出现第三种持久化格式或多套独立渲染器，再评估引入 `NormalizedResume`。

### 2. 将展示信息放入命名扩展

建议将项目专有数据放在单一根级 `x-web-resume` 下，而不是散落在每个标准对象中。这是本项目的命名约定，并非 JSON Resume 已定义的官方字段。

```yaml
x-web-resume:
  version: 1
  sectionOrder: [work, projects, education, skills, awards, other]
  sections:
    education:
      title: 教育背景
      icon: fa:graduation-cap
  other:
    title: 其他总结
    icon: ri:information-line
    info:
      - 热衷开源，关注前沿……
```

`sectionOrder` 应取代当前对 `Object.keys(resume)` 顺序的隐式依赖；这也为拖拽卡片排序提供稳定、可持久化的数据契约。

### 3. 提供两种导出模式

- **Portable**：只导出官方字段，并用 canonical schema 验证；丢弃图标、Logo、自定义总结等不可移植展示信息。
- **Lossless for web-resume**：导出官方字段及 `x-web-resume`；仍可通过 canonical schema，且再次导入本项目时能还原展示。

导出时必须将本地化日期规范化。对“至今”应省略 `endDate`，不应导出为空字符串或 `null`。无法可靠解析的日期应给出用户可操作的错误，而不是静默猜测。

### 4. 保留 legacy 读取，逐步迁移

可根据 `contact` / `project` / `skill` 等 legacy root key，以及 `education` 是 object 还是 array 进行格式检测。编辑器在用户明确执行“转换为 JSON Resume”前不自动重写原 YAML，以避免丢失注释和手工排版。

## 实施建议

1. **契约与回归基线（v0.4 已完成）**
   - 引入固定 minor 范围的 `@jsonresume/schema@~1.3.0`，增加 official sample 与最小 `{ basics: { name } }` fixture。
   - 为现有 YAML 建立 legacy fixtures，确保兼容层不改变当前渲染结果。
   - `ResumeInfo.work` 已在本次工作中补齐；以此作为 legacy 回归基线的一部分。

2. **格式模块与适配器（v0.4 已完成核心路径）**
   - 已实现格式检测、legacy 显式转换、JSON Resume 校验与渲染适配。
   - 为日期规范化、contact/profile 转换、keyword object 降级、award/certificate/publication 拆分写单元测试。
   - 记录转换 warning，尤其是 location、语义混合的 `project` 和 `certificate`。

3. **渲染覆盖**
   - 先支持当前已有组件可承载的 `basics/work/education/projects/skills/awards/certificates`。
   - 再为 `volunteer/publications/languages/interests/references` 增加组件或通用 section renderer。
   - 渲染顺序使用 `x-web-resume.sectionOrder` 或应用默认顺序，不再依赖 JSON/YAML key 顺序。

4. **用户界面与迁移**
   - 在加载时显示检测到的格式与非破坏性 warning。
   - 提供显式的“导出 JSON Resume”和“转换当前 YAML”操作，说明 Portable/Lossless 差异。
   - 待公开样例和文档迁移后，再考虑将 canonical model 设为新建简历的默认格式。

## 验收标准

- 官方 `sample.resume.json` 能直接加载，所有标准 section 均可渲染。
- Portable 导出能通过与应用依赖版本一致的 canonical schema 验证。
- Lossless 导出再导入后，section title/icon/order、item logo/open/badges 等项目展示数据不丢失。
- 所有现有公开 YAML 在 legacy 路径下保持可加载和可渲染。
- 非 ISO 日期、不可拆分 location 和语义模糊 section 会产生明确的转换 warning，不会静默丢数据。

## 决策

项目决定采用“标准优先、单一扩展、兼容读取”的 v0.4 迁移策略：

1. 新建与转换后的简历使用 JSON Resume 形状。
2. 标准无法表达的展示信息只进入根级 `x-web-resume`。
3. 旧 YAML 自动识别并在内存中适配，未经用户确认不写回。
4. v0.4 保留 legacy 读取；未来移除必须通过稳定版本契约和迁移说明。

完整升级与回退步骤见 [v0.4 JSON Resume 迁移指南](../../migrations/v0.4-json-resume.md)。
