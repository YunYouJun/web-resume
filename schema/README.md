# Resume schemas

- `resume.schema.json` accepts JSON Resume and legacy Web Resume documents during the v0.4 migration period.
- `json-resume.schema.json` is the pinned canonical schema from `@jsonresume/schema`.
- `resume-legacy.schema.json` preserves the previous Web Resume contract.

Regenerate all schema files with:

```bash
pnpm schema
```
