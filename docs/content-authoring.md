# Content Authoring Guide

This CRM is a static SPA that ingests Markdown files from `content/customers/` and builds them into `public/data/customers.json`.

Author one Markdown file per customer. Use JSON frontmatter between `---` lines at the top, followed by freeform Markdown for notes.

Required fields: `id`, `name`

Optional recommended fields: `account_owner`, `frameworks[]`, `services[]`, `tags[]`, `feature_requests[]`, `issues[]`, `contacts[]`.
Team-specific optional fields (if applicable): `members[]` (name, role, email), `libraries[]` (name, project), `meeting_dates[]`, `asks[]` (ask, due, status).

## Template

```
---
{
  "id": "acme-co",
  "name": "ACME Co.",
  "account_owner": "Jane Doe",
  "frameworks": ["Spark", "Flink"],
  "services": ["ETL", "Streaming"],
  "tags": ["strategic", "high-touch"],
  "feature_requests": [
    { "title": "Feature title", "status": "proposed|under-review|planned|shipped", "priority": "low|medium|high" }
  ],
  "issues": [
    { "date": "YYYY-MM-DD", "title": "Issue title", "severity": "minor|major|critical", "impact": "optional text" }
  ],
  "contacts": [
    { "name": "", "role": "", "email": "" }
  ]
}
---

# Overview

Short overview of the customer, key context, and goals.

## Recent Notes

- Bulleted updates, discoveries, meeting notes.

## Links

- [Relevant doc](https://example.com)
```

## Notes

- Frontmatter must be valid JSON (not YAML). This keeps the build script dependency-free.
- The Markdown body supports headings, lists, bold, italics, links, inline and fenced code blocks.
- Files are sorted by `name` in the grid; the detail view shows structured fields and renders the Markdown body as notes.

Note: Author both external customers and internal teams under `content/customers/`. Include team fields where relevant; the build script derives helpful defaults (e.g., frameworks from libraries, owner from members) when not provided. If `avatar` is omitted, a placeholder at `assets/avatars/avatar-template.svg` is used.
