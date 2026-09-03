# Contributing templates and preset data

Web Resume keeps layout templates separate from resume data. This makes every template comparable with the same content and prevents a visual choice from rewriting user data.

## Add preset data

1. Add a fictional, de-identified YAML file under `apps/web/public/resume/`.
2. Register a stable ID and metadata in `apps/web/src/data/resume-catalog.ts` and `apps/web/src/types/templates.ts`.
3. Add Chinese and English labels, descriptions, notices, and tags under `template_market` in both locale files.
4. Run `pnpm validate:catalog` and `pnpm e2e`.

Use `example.com` addresses and non-routable sample phone numbers. A fictional character or fan-made example must be labeled explicitly and must not depend on third-party avatars or other remote assets.

## Add a template

1. Add a stable template ID to `resumeTemplateIds`.
2. Register its category and feature tags in `apps/web/src/data/resume-catalog.ts`.
3. Implement layout rules under the matching `.resume--<id>` selector. Consume semantic `--resume-theme-*` tokens instead of embedding a palette in the template.
4. Add localized metadata and extend PDF and browser tests.

Categories describe purpose (`universal`, `professional`, or `creative`). Tags describe layout traits such as columns, density, print behavior, or ATS compatibility.

The catalog stays curated for now. Search and a reviewed submission flow should be considered when the collection grows beyond roughly 16–20 items.
