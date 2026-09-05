# 云同步发布检查清单

云同步横跨三个仓库，并由两个独立开关控制。在后端依赖和 SSO Client Registry 全部就绪前，必须保持关闭状态。

## 仅开启账号登录

账号会话与云简历分开发布：

- Pages 生产构建设置 `VITE_YLF_LOGIN_ENABLED=true`、`VITE_YLF_CLOUD_ENABLED=false`。
- Drive 设置 `NUXT_WEB_RESUME_LOGIN_ENABLED=true`，云简历开关 `NUXT_WEB_RESUME_ENABLED` 保持关闭。
- 主域实际由 Cloudflare Worker `web-resume` 转发静态资源到 `resume.elpsy.cn`。使用仓库 `workers/wrangler.toml` 发布 Worker；它直接处理 `/api/*`，保留 `resume.yunle.fun` 的 Origin，并使用 `YLF_LOGIN_API_ENABLED=true`、`YLF_CLOUD_API_ENABLED=false`。
- Cloudflare 为 `https://drive.yunle.fun/api/v1/web-resume/*` 配置 SSL `strict` Page Rule；否则 zone 的 Flexible SSL 会使 Worker 回源 HTTP，与 Drive 的 HTTPS 跳转形成循环。不要通过跟随重定向或关闭证书验证解决。
- 镜像 Pages 的 API 开关保持关闭；域名白名单让相同构建在镜像站仍不显示登录。
- 匿名 `/api/session` 应返回 401，`/api/documents` 应返回 404。登录不会自动上传简历，也不会覆盖本地联系资料。

### apps.yunle.fun 模拟器验收

1. 启动本地云乐坊 iOS 模拟器应用，登录测试账号。
2. 在应用内打开 `https://resume.yunle.fun/user`，点击“使用云乐坊账号登录”。必须在宿主内嵌浏览器打开，而不是系统 Safari。
3. 应出现带 Web Resume 名称及来源的宿主授权确认；确认后页面显示账号，刷新后仍保持会话。
4. 取消应回到可重试状态；未登录宿主应先引导登录，再返回授权。账号资料不得覆盖本地姓名、电话和邮箱。
5. 本地开发仅使用已注册的 `https://resume.yunle.localhost:3455`；开发后端 Origin 也需精确匹配，不要为了模拟器添加通配域名或绕过证书校验。

## 范围与生产配置

| 项目 | 生产值 |
| --- | --- |
| Web Resume Origin | `https://resume.yunle.fun` |
| SSO client / app | `web-resume-web` / `web-resume` |
| Redirect | `https://resume.yunle.fun/user` |
| Scope | `identity:bootstrap` |
| Drive BFF 前缀 | `https://drive.yunle.fun/api/v1/web-resume` |
| 元数据集合 | `web_resume_documents`（`ADMINONLY`） |
| 单份简历上限 | 2 MiB |
| 回收站保留 | 30 天 |

唯一注册的开发 Origin 是 `https://resume.yunle.localhost:3455`，回调路径为 `/user`。预览域名和镜像站必须保持云同步关闭。

## 部署前检查

1. 在 `www.yunle.fun` 中创建 `web_resume_documents`，设置 `ADMINONLY` 权限，并创建 `cloudfunctions/user-storage-api/web-resume-resources.js` 声明的全部索引。
2. 生成两个彼此独立、至少 32 bytes 的随机服务令牌。`WEB_RESUME_STORAGE_INTERNAL_TOKEN` 同时配置到 `user-storage-api` 与 Drive BFF；`WEB_RESUME_SWEEPER_INTERNAL_TOKEN` 同时配置到两个存储云函数。令牌不得出现在公开变量或 `VITE_` 变量中。
3. 私有 COS Bucket 继续保持 private。CORS 只允许精确生产 Origin、`PUT` 和 `Content-Type`，不得使用通配 Origin 或携带凭据的跨域规则。
4. 部署更新后的 `user-storage-api` 和私有 `web-resume-storage-sweeper`，验证一次存储预留、完成、删除闭环，以及 sweeper 返回的有界计数。
5. 为 Drive 配好全部 `NUXT_WEB_RESUME_*`，但先保持 `NUXT_WEB_RESUME_ENABLED=false`。确认会话存储、限流集合、CloudBase 凭据和 CSRF secret 健康。
6. 审阅 `www.yunle.fun/specs/sso-client-registry-platform/drafts/` 中已生成但未签名的生产与开发草案，走现有审批和签名发布流程；不得手改或发布未签名草案。

## 开启顺序

1. 在 Drive 开启 `NUXT_WEB_RESUME_ENABLED=true`。前端尚未开启时，先确认匿名请求返回 `401`、非允许 Origin 返回 `403`，并用获准测试账号验证 Drive 只读入口。
2. 使用真实测试账号完成 SSO、首次保存、自动保存、下载、冲突副本、回收站、恢复、退出和第二设备会话。核对原始 YAML 校验和及共享配额变化。
3. 使用 `apps/web/.env.example` 中的生产配置，并设置 `VITE_YLF_CLOUD_ENABLED=true` 构建 Web Resume；同一发布中开启 Cloudflare Pages 运行时开关 `YLF_CLOUD_API_ENABLED=true`。
4. 在桌面端和移动端完成浏览器冒烟。桌面端应同时显示右上角账号入口和“我的”，移动端只显示底部“我的”。
5. 观察会话交换、存储 reserve/finalize 失败、冲突副本率、配额变化和回收站清理错误，再逐步扩大流量。

## 回滚

先关闭 `YLF_CLOUD_API_ENABLED`，切断同源代理，再关闭 `NUXT_WEB_RESUME_ENABLED`。随后可以用 `VITE_YLF_CLOUD_ENABLED=false` 重新构建前端以隐藏界面。保留 Registry 条目、元数据集合、私有对象和清理任务，确保已有用户数据仍可恢复；回滚不得删除云端简历。
