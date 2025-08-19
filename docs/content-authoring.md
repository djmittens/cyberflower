# Content Authoring Guide

This CRM is a static SPA that ingests Markdown files from `content/customers/` and builds them into `public/data/customers.json`.

Author one Markdown file per customer. Use JSON frontmatter between `---` lines at the top, followed by freeform Markdown for notes.

Required fields: `id`, `name`

Optional recommended fields: `account_owner`, `frameworks[]`, `services[]`, `tags[]`, `feature_requests[]`, `issues[]`, `contacts[]`.

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

## Teams

Author teams in `content/teams/` with the following JSON frontmatter. The Markdown body is used for meeting notes or longer docs.

```
---
{
  "id": "neon-core",
  "name": "Neon Core",
  "avatar": "assets/avatars/neon-core.svg",
  "members": [
    { "name": "Ava Reed", "role": "Tech Lead" },
    { "name": "Max Ono", "role": "Data Engineer" }
  ],
  "libraries": [
    { "name": "Spark", "project": "Finance ETL" },
    { "name": "dbt", "project": "Sales Models" }
  ],
  "meeting_dates": ["2025-08-15", "2025-09-12"],
  "asks": [
    { "ask": "Dedicated test cluster", "due": "2025-09-01", "status": "proposed" },
    { "ask": "New CDC connector", "due": "2025-10-10", "status": "under-review" }
  ]
}
---

# Meeting Notes

- Highlights and decisions.
- Risks and follow-ups.
```

Note: The site builds a unified customer catalog that includes external customers from `content/customers/` and internal teams from `content/teams/`. Internal teams are tagged as `internal` and show members, libraries, meeting dates, and asks in the detail view.
