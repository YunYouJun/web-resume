# Web Resume User Guide

<p align="center">
  <b>English</b> | <a href="../zh/guide/">简体中文</a>
</p>

Web Resume turns a YAML file into a web resume and an A4 PDF. You can try it entirely in the browser, keep your resume in a URL-accessible file, or run the project locally for full control.

## 1. Choose a workflow

| Goal | Recommended workflow |
| --- | --- |
| Try layouts with sample data | Open the [template explorer](https://resume.yunle.fun/explore) |
| Edit a resume without installing anything | Use the online editor |
| Publish a resume from GitHub or another host | Load a public raw YAML URL |
| Keep the source private or under local version control | Run Web Resume locally |
| Generate a repeatable PDF | Use the PDF export CLI |

Online edits and preferences are stored in the current browser. They do not update the original YAML file. Keep your source YAML separately if you need durable storage, version history, or editing across devices.

## 2. Use Web Resume online

### Explore templates and examples

Open [`/explore`](https://resume.yunle.fun/explore), choose a data preset, and compare it with the three built-in layouts:

- `classic`: general-purpose, single-column layout
- `sidebar`: distinctive two-column layout
- `compact`: dense layout intended for a one-page resume

Selecting a template changes presentation only; it does not rewrite resume data.

### Load a YAML file

Choose **File → Load resume**, enter the direct URL of a YAML file, and load it. The server hosting the file must:

- return the YAML itself rather than an HTML page;
- allow the Web Resume origin to fetch it with CORS; and
- be reachable without an interactive login.

Resume summaries and highlights may contain lightweight inline HTML. Web Resume removes executable tags, event handlers, unsafe link protocols, and unsupported markup before rendering remote content.

GitHub users should use a raw file URL, for example:

```text
https://raw.githubusercontent.com/OWNER/REPOSITORY/BRANCH/resume.yml
```

You can also create a direct link:

```text
https://resume.yunle.fun/?url=ENCODED_YAML_URL&template=classic
```

Supported query parameters are:

| Parameter | Values | Purpose |
| --- | --- | --- |
| `url` | An URL-encoded YAML URL | Load your own resume |
| `example` | A built-in example ID | Load preset data |
| `template` | `classic`, `sidebar`, `compact` | Select a layout |
| `mode` | `preview` | Hide the application controls |

Use either `url` or `example` as the data source. For example:

```text
https://resume.yunle.fun/?example=graduate&template=compact&mode=preview
```

### Edit the resume

Open the editor from the navigation or command palette. The YAML editor validates the document while the preview updates.

In the preview, drag a section to reorder it. The move-up and move-down controls are available for keyboard and touch use. Reordering updates the YAML text and remains undoable in the editor.

For a standard document, the display order is stored in `x-web-resume.sectionOrder`; the standard section data itself is not modified. For a legacy document, the editor reorders the corresponding top-level YAML blocks. These controls are shown only on the editor page, not on a shared preview.

Useful commands include:

- `Ctrl/Cmd + Shift + P`: open the Web Resume command palette
- `F1`: open editor commands while on the editor page
- **Format YAML**: format the current document
- **Restore example**: replace the editor content with the default example; the immediate restore can be undone

### Select a template and set preferences

Choose a template from **View → Templates**, or configure it on the Settings page. Settings also contains the theme, interface language, and local profile override.

The profile override can replace the name, phone number, and email shown in a loaded resume. This profile stays in the current browser and is applied only when the override is enabled. It does not modify the YAML source.

### Share a preview

Choose **File → Copy share link**. The link contains the source URL or built-in example ID, selected template, and preview mode. It does not contain your unsaved editor text or browser-local profile. To share edits, first publish the updated YAML at an accessible URL and load that URL.

### Convert an older resume

Legacy Web Resume files continue to load without being rewritten. When the editor detects the older `contact`, `project.sets`, or similar structure, it displays a **Review and convert** action. Review the warnings before confirming: ambiguous projects, awards, locations, dates, and YAML comments may need manual attention. Conversion is one editor operation, so you can immediately use Undo to restore the previous text.

For a file-based workflow, check or convert without opening the browser:

```bash
pnpm migrate:resume -- --input ./resume.yml --check
pnpm migrate:resume -- --input ./resume.yml --output ./resume.v0.4.yml
```

The command never overwrites the input implicitly. See the [v0.4 migration guide](../migrations/v0.4-json-resume.md) for field mappings, warnings, and rollback details.

## 3. Write the YAML file

YAML uses indentation to express structure. Use spaces, keep indentation consistent, and quote values that YAML might interpret as another type. New files should use the JSON Resume field structure; YAML is only the authoring syntax. JSON Resume sections are optional, so start with the fields you need.

A minimal valid document is:

```yaml
basics:
  name: Ada Lovelace
  label: Software Engineer
  summary: I build reliable tools for people.
  email: ada@example.com
  phone: +44 1234 567890
  url: https://example.com
  location:
    city: London

work:
  - name: Analytical Engines Ltd.
    position: Software Engineer
    startDate: 2024-01
    highlights:
      - Built reliable tools for people.

x-web-resume:
  version: 1
  sectionOrder: [work]
```

Top-level fields:

| Field | Contents |
| --- | --- |
| `basics` | Name, label, summary, image, email, phone, URL, location, and profiles |
| `work` | Employment entries |
| `volunteer` | Volunteer experience |
| `education` | Education entries |
| `awards` / `certificates` | Awards and credentials |
| `publications` | Publications |
| `skills` | Skill groups and keyword lists |
| `languages` / `interests` / `references` | Languages, interests, and references |
| `projects` | Project entries |
| `meta` | Canonical URL, version, and update metadata |
| `x-web-resume` | Web Resume-only presentation data such as icons, logos, custom content, and section order |

Prefer standard fields whenever they express the intended meaning. Put presentation-only or Web Resume-specific data under the single `x-web-resume` extension instead of inventing additional top-level sections. Refer to the [JSON Resume compatibility assessment](../zh/reference/json-resume-compatibility.md) for detailed mappings and [`apps/web/src/assets/schema/resume.schema.json`](https://github.com/YunYouJun/web-resume/blob/main/apps/web/src/assets/schema/resume.schema.json) for the accepted editor schema.

Choose **File → Export portable JSON Resume** to download a canonical `.resume.json` copy. Portable export removes `x-web-resume` and non-standard fields recursively, then validates the result. Your editor document and its presentation settings remain unchanged.

Icons use [Iconify](https://iconify.design/) names such as `ri:mail-line`. You can search available names on [Icônes](https://icones.js.org/). Item `logo` fields also accept image paths or HTTP(S) URLs; SVG is recommended for project and organization logos because it stays sharp at every output size. Remote images must remain accessible when the page or PDF is rendered.

```yaml
logo: /img/project-logo.svg
# or: https://cdn.example.com/project-logo.svg
# or an Iconify name: ri:github-line
```

## 4. Run locally

### Requirements

- Node.js 22.12 or later
- pnpm 10 (the repository pins the exact package-manager version)
- Chrome or Chromium for printing and automated PDF export

### Install and preview

Create a repository from **Use this template**, or clone this project:

```bash
git clone https://github.com/YunYouJun/web-resume.git
cd web-resume
corepack enable
pnpm install
pnpm dev
```

Put your YAML file under `apps/web/public/resume/`, for example `apps/web/public/resume/my.resume.yml`, then open:

```text
http://localhost:3000/?url=/resume/my.resume.yml
```

Vite serves files under `apps/web/public/` from the site root. Reload the page after changing the YAML source. You can also load the local URL through **File → Load resume**.

Recommended checks:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

The generated production site is written to `dist/`. To inspect it locally, run `pnpm preview` after building.

For YAML completion and validation in VS Code, install [YAML by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) and associate resume files with the repository schema in `.vscode/settings.json`:

```json
{
  "yaml.schemas": {
    "./apps/web/src/assets/schema/resume.schema.json": [
      "**/*.resume.yml"
    ]
  }
}
```

## 5. Export PDF

### Browser printing

Choose **File → Export PDF** or press `Ctrl/Cmd + P`. In the print dialog:

1. Select **Save as PDF**.
2. Use A4 paper.
3. Enable background graphics if your browser provides that option.
4. Adjust scale if the last section spills onto an extra page.

Chrome or Chromium is recommended because print rendering varies between browsers.

### Command-line export

Export a local file:

```bash
pnpm export:pdf -- \
  --input ./apps/web/public/resume/neutral.resume.yml \
  --output ./resume.pdf \
  --template classic \
  --scale 1
```

Export a hosted file:

```bash
pnpm export:pdf -- --input https://example.com/resume.yml --output ./resume.pdf
```

Options:

| Option | Description |
| --- | --- |
| `-i`, `--input` | Required local YAML path or HTTP(S) URL |
| `-o`, `--output` | Output path; defaults to `resume.pdf` |
| `--template` | `classic`, `sidebar`, or `compact`; defaults to `classic` |
| `--scale` | Print scale from `0.1` to `2`; defaults to `1` |
| `--no-build` | Reuse the existing `dist/` directory |

The command validates the YAML before rendering it. By default it also builds the app. Install the Playwright browser if Chromium is missing:

```bash
pnpm exec playwright install chromium
```

For a Cloudflare Access-protected URL, set both environment variables before exporting:

```bash
export CF_ACCESS_CLIENT_ID=your-client-id
export CF_ACCESS_CLIENT_SECRET=your-client-secret
pnpm export:pdf -- --input https://example.com/resume.yml
```

## 6. Troubleshooting

### The URL returns HTML instead of YAML

Use the direct/raw file URL. Repository page URLs and login redirects usually return HTML and cannot be parsed as a resume.

### The online app cannot load a valid YAML URL

Check the browser console or the displayed HTTP status. The host must allow cross-origin browser requests. If you cannot change its CORS policy, host the YAML elsewhere or run Web Resume locally.

### The preview disappears after an edit

Fix the first YAML syntax or schema error reported by the editor. Common causes are tabs, inconsistent indentation, an unquoted colon inside a value, or using a legacy object shape inside a standard array section.

### Shared viewers see different personal details

Disable the local profile override when verifying a public resume. Browser-local profile values are not included in share links.

### The PDF has an extra page

Try the `compact` template, shorten content, or reduce the print scale slightly. Always inspect the generated PDF for clipped text and inaccessible remote images.
