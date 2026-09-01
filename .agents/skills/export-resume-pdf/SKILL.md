---
name: export-resume-pdf
description: Export a web-resume YAML file or URL to a verified PDF. Use when the user asks to generate, print, render, or batch-create PDF resumes from this repository.
---

# Export Resume PDF

Use the repository CLI as the single export implementation:

```bash
pnpm export:pdf -- --input <path-or-url> --output <pdf-path>
```

Run `pnpm export:pdf -- --help` when options are needed. Keep generated PDFs outside version control unless the user requests otherwise.

For an Access-protected URL, use `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` from the environment. The Access application must include a Service Auth policy for that token. Keep credentials in the Node process environment and out of prompts, command output, URLs, and browser code.

After export, require all of these completion criteria:

- The command exits successfully and the output starts with `%PDF-`.
- `pdfinfo` reports at least one A4 page.
- Text extracted with `pdftotext` or `pdfplumber` contains the resume name and representative section text.
- Render every page to PNG with `pdftoppm` and inspect for clipping, overlap, missing glyphs, or blank pages.

Report missing browser binaries, Access authorization, invalid YAML, and rendering failures as distinct blockers.
