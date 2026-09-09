# EdgeOne Pages 部署

项目 `yunyoujun-web-resume` 关联本仓库 `main` 分支，仓库根目录的 `edgeone.json` 固定 Node 24.18.0、pnpm 11.25.0、安装命令和构建产物目录 `dist`。构建同时包含 Web 应用与 `/docs/` 文档。

此前控制台使用 Node 22.11.0；pnpm 11 要求至少 Node 22.13，导致安装阶段失败，线上继续保留旧部署。仅刷新 CDN 缓存无法修复构建失败。

## 域名与登录

- `web-resume.yunyoujun.cn`：直接访问 EdgeOne Pages。
- `resume.yunle.fun`：Cloudflare Worker `web-resume` 将页面和文档转发到上述 EdgeOne 域名，两个入口使用同一份构建产物。
- 主域 `/api/*` 仍由 Worker 处理，再访问 Drive API。登录开启，云简历存储关闭；页面代理不会携带 Cookie 或 Authorization。
- 构建开启登录界面，但前端仍检查访问域名，镜像域名不会启用账号功能。浏览器本地简历按域名隔离，不会随部署自动同步。

这是页面源站迁移，主域 DNS 和登录网关仍在 Cloudflare。若后续要完全移除 Cloudflare，需要先迁移并验证同源 API、会话 Cookie、CSRF 和 SSO 回调，再切换 DNS。

## 发布验证与回滚

合并前验证 EdgeOne 预览部署成功；合并后确认生产部署对应最新提交，再发布 `workers/wrangler.toml`。检查两个域名的首页资源版本、`/settings`、`/docs/`，以及主域 `/api/session` 返回 JSON、`/api/documents` 保持关闭。

EdgeOne 可切回之前成功的部署。若页面源站不可用，也可将 Worker 的 `ASSET_ORIGIN` 恢复为 `https://resume.elpsy.cn` 并重新发布；不要变更 API 开关或删除用户数据。
