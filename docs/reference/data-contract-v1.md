# Data contract for v1

This document defines the target stable resume-data contract for Web Resume v1. It can be implemented during 0.x, but becomes a compatibility guarantee only when v1.0.0 is released.

## Stable input

- The canonical model is the JSON Resume schema bundled with the released app.
- Resume data may be authored as YAML or JSON; the file syntax does not change the model.
- Standard fields are preferred whenever they accurately express the content.
- Web Resume presentation data uses only the root `x-web-resume` extension.
- `x-web-resume.version` versions the extension independently and starts at `1`.

The release pins a compatible `@jsonresume/schema` minor line. Moving to an incompatible canonical schema or changing the meaning of persisted extension fields requires a Web Resume major release or an explicit migration path.

## Compatibility guarantees

- Valid canonical documents load without requiring `x-web-resume`.
- Unknown canonical fields are preserved while editing unless the user explicitly chooses Portable export.
- Lossless Web Resume documents preserve section order, titles, icons, item presentation data, custom content, and footer data under `x-web-resume`.
- Portable export contains only canonical fields and is validated before download.
- Loading, conversion, reordering, and export never silently overwrite the original URL or disk file.

## Legacy documents

The pre-v0.4 Web Resume structure is a compatibility input, not the v1 canonical authoring format. It remains detectable and explicitly convertible. Any future removal of direct legacy rendering must:

1. be announced in release notes;
2. retain or provide a tested conversion command;
3. document fields that require manual review; and
4. ship only at a version boundary that permits the compatibility change.

## Extension boundary

`x-web-resume` may contain presentation and application-specific information, including section order, section titles and icons, item logos and badges, custom contact presentation, free-form `other` content, and footer display data. It must not duplicate standard content merely to avoid using a canonical field.

Consumers that do not understand the extension may ignore it. Users who need maximum interoperability should use Portable export; users who need Web Resume round-tripping should keep the lossless YAML or JSON source.
