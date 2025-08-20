---
{
  "id": "neon-core",
  "name": "Neon Core",
  "avatar": "assets/avatars/neon-core.svg",
  "members": [
    { "name": "Ava Reed", "role": "Tech Lead" },
    { "name": "Max Ono", "role": "Data Engineer" },
    { "name": "Jules Park", "role": "SRE" },
    { "name": "Chen Li", "role": "Senior Data Engineer" },
    { "name": "Sarah Kim", "role": "DevOps Engineer" },
    { "name": "Marcus Thompson", "role": "Platform Engineer" }
  ],
  "libraries": [
    { "name": "Spark", "project": "Finance ETL" },
    { "name": "Airflow", "project": "Batch Orchestration" },
    { "name": "Delta Lake", "project": "Data Lake" },
    { "name": "Kubernetes", "project": "Container Orchestration" },
    { "name": "Terraform", "project": "Infrastructure as Code" },
    { "name": "Prometheus", "project": "Monitoring" },
    { "name": "Grafana", "project": "Observability" },
    { "name": "Apache Kafka", "project": "Event Streaming" }
  ],
  "meeting_dates": ["2025-08-20", "2025-09-17", "2025-10-15", "2025-11-19"],
  "asks": [
    { "ask": "Dedicated test cluster", "due": "2025-09-01", "status": "proposed" },
    { "ask": "Infra budget approval", "due": "2025-09-15", "status": "under-review" },
    { "ask": "Additional GPU resources", "due": "2025-09-30", "status": "planned" },
    { "ask": "Security audit for new pipeline", "due": "2025-10-10", "status": "proposed" },
    { "ask": "Cross-region backup strategy", "due": "2025-10-20", "status": "under-review" },
    { "ask": "Performance optimization budget", "due": "2025-11-01", "status": "proposed" }
  ],
  "frameworks": ["Spark", "Airflow", "Delta Lake"],
  "services": ["ETL", "Data Lake", "Batch Processing"],
  "tags": ["critical", "finance", "core-infrastructure"]
}
---

# Team Overview

Neon Core is the backbone data engineering team responsible for all critical finance and core business data pipelines. We handle massive scale ETL operations processing over 10TB of data daily across multiple business units.

## Current Projects

### Q3 2025 Initiatives
- **Project Phoenix**: Complete migration of legacy finance ETL to Delta Lake architecture
- **Real-time Analytics**: Implement streaming analytics for fraud detection
- **Cost Optimization**: Reduce compute costs by 40% through better resource management
- **Data Governance**: Implement comprehensive data lineage tracking

### Infrastructure Improvements
- **Cluster Autoscaling**: Dynamic resource allocation based on workload patterns  
- **Multi-region Setup**: Disaster recovery across 3 AWS regions
- **Performance Monitoring**: Real-time pipeline health dashboards
- **Security Hardening**: Zero-trust security model implementation

## Meeting Notes

### August 20, 2025 - Sprint Planning
- Completed Delta Lake migration for customer data (85% done)
- Performance improvements showed 60% faster query times
- Identified bottlenecks in nightly reconciliation jobs
- Need to resolve Spark memory optimization issues

### Technical Discussions
- **Pipeline Reliability**: Implementing circuit breaker patterns for external API calls
- **Data Quality**: Adding automated data validation at ingestion points
- **Monitoring**: Enhanced alerting for SLA violations
- **Capacity Planning**: Projected 200% growth in data volume by Q1 2026

## Key Challenges

### Resource Constraints
- Current test environment insufficient for load testing
- GPU resources needed for ML feature engineering
- Storage costs increasing with data retention requirements

### Technical Debt
- Legacy Hadoop clusters still running critical monthly reports
- Manual deployment processes causing deployment delays
- Inconsistent data schemas across different source systems

### Compliance & Security
- GDPR compliance for European customer data
- SOX compliance for financial reporting pipelines
- Data encryption at rest and in transit requirements

## Upcoming Milestones

1. **September 1**: Complete test cluster provisioning
2. **September 15**: Finalize infrastructure budget planning
3. **September 30**: Launch GPU-accelerated feature engineering
4. **October 10**: Security audit completion
5. **October 20**: Cross-region backup implementation
6. **November 1**: Performance optimization project kickoff

## Team Metrics

### Current Performance
- **Pipeline Uptime**: 99.97% SLA achievement
- **Data Freshness**: 95% of reports delivered within 2 hours
- **Cost Efficiency**: 15% under budget for Q3
- **Incident Response**: Average resolution time 12 minutes

### Goals for Q4
- Achieve 99.99% pipeline uptime
- Reduce data latency to under 30 minutes
- Maintain cost efficiency while scaling 2x
- Implement predictive alerting to prevent incidents

