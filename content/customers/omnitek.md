---
{
  "id": "omnitek",
  "name": "OmniTek Systems",
  "account_owner": "Ravi Narayan",
  "frameworks": ["Flink", "Kafka"],
  "services": ["Streaming", "CDC"],
  "tags": ["growth", "self-serve"],
  "feature_requests": [
    { "title": "Exactly-once sinks for Snowflake", "status": "proposed", "priority": "high" }
  ],
  "issues": [
    { "date": "2025-08-03", "title": "Checkpoint instability in staging", "severity": "minor" }
  ],
  "contacts": [
    { "name": "Lin Zhao", "role": "Platform Eng", "email": "lin@omnitek.example" }
  ]
}
---

# Summary

OmniTek focuses on ultra-low-latency streams; they prefer self-serve patterns and minimal SLO dependencies.

## Notes

- Concerned about cross-region lag during failover.
- Requests better observability hooks from connectors.

