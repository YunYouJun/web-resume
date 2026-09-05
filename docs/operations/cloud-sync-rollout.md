# Cloud sync rollout checklist

Cloud sync spans three repositories and two independent feature flags. It must remain fail-closed until every backend dependency and the SSO client entry are ready.

## Scope and production values

| Component | Production value |
| --- | --- |
| Web Resume origin | `https://resume.yunle.fun` |
| SSO client / app | `web-resume-web` / `web-resume` |
| Redirect | `https://resume.yunle.fun/user` |
| Scope | `identity:bootstrap` |
| Drive BFF prefix | `https://drive.yunle.fun/api/v1/web-resume` |
| Metadata collection | `web_resume_documents` (`ADMINONLY`) |
| Resume object limit | 2 MiB |
| Trash retention | 30 days |

The only registered development origin is `https://resume.yunle.localhost:3455`, with redirect `/user`. Preview domains and mirrors must keep cloud sync disabled.

## Pre-deployment checks

1. In `www.yunle.fun`, create `web_resume_documents` with `ADMINONLY` ACL and all indexes declared by `cloudfunctions/user-storage-api/web-resume-resources.js`.
2. Generate two independent random service tokens of at least 32 bytes. Configure `WEB_RESUME_STORAGE_INTERNAL_TOKEN` on `user-storage-api` and the Drive BFF; configure `WEB_RESUME_SWEEPER_INTERNAL_TOKEN` on both storage functions. Never expose either token through a public or `VITE_` variable.
3. Keep the private COS bucket private. Its CORS rule must allow the exact production origin, `PUT`, and `Content-Type`; do not use wildcard origins or credentialed CORS.
4. Deploy the updated `user-storage-api` and private `web-resume-storage-sweeper`, then verify a dry storage reserve/finalize/delete cycle and the sweeper's bounded result counters.
5. Deploy Drive with all `NUXT_WEB_RESUME_*` values configured but `NUXT_WEB_RESUME_ENABLED=false`. Confirm its session store, rate-limit collection, CloudBase credentials, and CSRF secret are healthy.
6. Review the generated unsigned production and development Registry drafts in `www.yunle.fun/specs/sso-client-registry-platform/drafts/`. Complete the existing approval and signed Registry publication workflow; do not hand-edit or publish an unsigned draft.

## Enablement order

1. Enable `NUXT_WEB_RESUME_ENABLED=true` on Drive. Before the frontend is enabled, verify anonymous calls return `401`, disallowed origins return `403`, and the read-only Drive connector works for an authorized test account.
2. Run a real test account through SSO, first save, autosave, download, conflict copy, Trash, restore, logout, and a second-device session. Verify the raw YAML checksum and shared quota deltas.
3. Build Web Resume with `VITE_YLF_CLOUD_ENABLED=true` and the production values in `apps/web/.env.example`. Enable the Cloudflare Pages runtime flag `YLF_CLOUD_API_ENABLED=true` in the same release.
4. Run browser smoke tests on desktop and mobile. Desktop must show the account control in the top-right and “My” navigation; mobile must show only the bottom “My” entry.
5. Observe session exchange failures, storage reserve/finalize failures, conflict-copy rate, quota changes, and sweeper errors before expanding traffic.

## Rollback

Disable `YLF_CLOUD_API_ENABLED` first to close the same-origin proxy, then disable `NUXT_WEB_RESUME_ENABLED`. A later frontend build may set `VITE_YLF_CLOUD_ENABLED=false` to hide the UI. Keep the Registry entry, metadata collection, private objects, and sweeper in place so existing user data remains recoverable; rollback must not delete cloud resumes.

## Account-only rollout

Set `VITE_YLF_LOGIN_ENABLED=true` in the production Pages build and `NUXT_WEB_RESUME_LOGIN_ENABLED=true` in Drive. Keep the cloud storage flags disabled. Deploy `workers/wrangler.toml` for the main domain: the Worker handles `/api/*` directly before proxying static assets to `resume.elpsy.cn`, preserving the registered Origin. Mirror API flags remain off. Verify anonymous session requests return 401 and document requests return 404.

For the local Apps iOS simulator, sign in to a test account, open `https://resume.yunle.fun/user` in the host web view, and exercise consent, cancellation, session reload, and logout. Signing in must not upload a resume or replace local contact details.
