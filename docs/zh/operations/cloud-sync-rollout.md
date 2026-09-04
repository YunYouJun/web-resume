# 云同步发布检查清单

云同步横跨三个仓库，并由两个独立开关控制。在后端依赖和 SSO Client Registry 全部就绪前，必须保持关闭状态。

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
