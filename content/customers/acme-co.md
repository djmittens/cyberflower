---
{
  "id": "acme-co",
  "name": "ACME Co.",
  "account_owner": "Jane Doe",
  "frameworks": ["Spark", "Delta Lake"],
  "services": ["Batch ETL", "Data Lake"],
  "tags": ["strategic", "high-touch"],
  "feature_requests": [
    { "title": "Native Delta Lake time travel", "status": "proposed", "priority": "high" },
    { "title": "Faster schema inference", "status": "under-review", "priority": "medium" }
  ],
  "issues": [
    { "date": "2025-07-12", "title": "Backpressure on nightly jobs", "severity": "major" }
  ],
  "contacts": [
    { "name": "Bob Smith", "role": "Data Eng Lead", "email": "bob@acme.example" }
  ]
}
---

# Overview

ACME Co. runs a multi-TB nightly pipeline backed by Delta Lake. They are a high-touch strategic account with strong roadmap influence.

## Recent Notes

- Evaluating time-travel support to unblock compliance workflows.
- Pain around schema drift; wants better automatic resolution.

## Links

- [Design doc: ACME Delta Adoption](https://example.com/)

```sql
-- Example of desired time-travel usage
SELECT * FROM acme.delta_table VERSION AS OF 42;
```

