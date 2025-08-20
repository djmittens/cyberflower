---
{
  "id": "model-makers",
  "name": "Model Makers",
  "avatar": "assets/avatars/model-makers.svg",
  "members": [
    { "name": "Sara Davidson", "role": "Principal Analytics Engineer" },
    { "name": "Leo Volkov", "role": "Senior Analytics Engineer" },
    { "name": "Zoe Martinez", "role": "Analytics Engineer" },
    { "name": "Raj Patel", "role": "Data Modeling Specialist" },
    { "name": "Emma Thompson", "role": "Business Intelligence Engineer" },
    { "name": "Carlos Rodriguez", "role": "Analytics Platform Engineer" }
  ],
  "libraries": [
    { "name": "dbt", "project": "Core Data Models & Transformations" },
    { "name": "DuckDB", "project": "Ad-hoc Analytics & Prototyping" },
    { "name": "Looker", "project": "Business Intelligence Platform" },
    { "name": "Tableau", "project": "Executive Dashboards" },
    { "name": "Great Expectations", "project": "Data Quality Testing" },
    { "name": "Apache Superset", "project": "Self-Service Analytics" },
    { "name": "Metabase", "project": "Departmental Reporting" },
    { "name": "Evidence", "project": "Data Documentation & Reports" }
  ],
  "meeting_dates": ["2025-08-21", "2025-09-25", "2025-10-23", "2025-11-27"],
  "asks": [
    { "ask": "Model test coverage dashboard", "due": "2025-09-30", "status": "planned" },
    { "ask": "dbt Cloud enterprise license", "due": "2025-10-15", "status": "under-review" },
    { "ask": "Data warehouse compute scaling", "due": "2025-10-30", "status": "proposed" },
    { "ask": "Analytics engineering hiring budget", "due": "2025-11-15", "status": "under-review" },
    { "ask": "BI tool consolidation project", "due": "2025-12-01", "status": "planned" }
  ],
  "frameworks": ["dbt", "SQL", "Python"],
  "services": ["Data Modeling", "Business Intelligence", "Analytics"],
  "tags": ["analytics", "data-modeling", "business-intelligence", "self-service"]
}
---

# Model Makers - Analytics Engineering Team

The Model Makers are the analytics engineering powerhouse responsible for transforming raw data into reliable, accessible business insights. We maintain 500+ data models serving 1,000+ stakeholders across the organization with self-service analytics capabilities.

## Data Modeling Architecture

### dbt Core Infrastructure
- **Models**: 500+ dbt models covering all business domains (finance, marketing, product, ops)
- **Tests**: 2,000+ data quality tests ensuring model reliability and accuracy
- **Documentation**: Comprehensive model lineage and business logic documentation
- **Orchestration**: Automated daily builds with incremental model refresh strategies

### Data Warehouse Design
- **Star Schema**: Dimensional modeling with fact/dimension tables for optimal query performance
- **SCD Type 2**: Slowly changing dimensions tracking historical attribute changes
- **Aggregate Tables**: Pre-computed metrics reducing query time from minutes to seconds
- **Partitioning**: Time-based partitioning across 3 years of historical data

## Current Analytics Initiatives

### Project Metrics 2.0 - Unified KPI Framework
**Objective**: Standardize key performance indicators across all business units
- **Scope**: Define canonical metrics for revenue, growth, retention, and operational efficiency
- **Challenge**: Reconciling different calculation methodologies across departments
- **Progress**: 75% complete, finance and marketing metrics standardized
- **Impact**: Reduced "metric confusion" incidents by 90%, improved decision-making speed

### Self-Service Analytics Platform
**Objective**: Enable business users to create their own reports without engineering support
- **Tools**: Looker modeling layer with curated explores and dimensions
- **Training**: Quarterly workshops teaching SQL and analytics best practices
- **Adoption**: 400+ business users now creating their own analyses
- **Efficiency**: Reduced analytics request backlog from 200 to 20 tickets

### Real-Time Analytics Integration
**Objective**: Blend batch and streaming data for near real-time business insights
- **Architecture**: dbt models consuming both warehouse and Kafka streaming data
- **Use Cases**: Live product analytics, real-time fraud monitoring, instant marketing attribution
- **Timeline**: Pilot with product analytics team, full rollout Q1 2026
- **Technical Challenge**: Managing data freshness vs computational cost tradeoffs

## Data Quality & Governance

### Comprehensive Testing Framework
- **Model Tests**: Every model has uniqueness, not-null, and referential integrity tests
- **Business Logic Tests**: Custom tests validating complex business rules and calculations
- **Data Freshness**: Automated alerts when critical data sources become stale
- **Anomaly Detection**: Statistical tests identifying unusual patterns in key metrics

### Documentation Standards
- **Model Documentation**: Every model includes purpose, business logic, and known limitations
- **Column Descriptions**: All columns have human-readable descriptions and business context
- **Lineage Tracking**: Visual dependency graphs showing data flow through transformation layers
- **Change Management**: All model changes require peer review and impact assessment

## Meeting Notes & Technical Discussions

### August 21, 2025 - Model Standards Review
**Key Initiatives:**
- **Naming Conventions**: Implemented semantic model naming (fct_, dim_, int_, stg_ prefixes)
- **Metadata Framework**: Added business glossary integration for consistent terminology
- **Model Contracts**: Defining API contracts between upstream sources and downstream models
- **Performance Optimization**: Identified 20 models consuming 80% of warehouse compute

**Quality Improvements:**
- Introduced model-level SLAs with automated monitoring and alerting
- Standardized testing patterns across all business domain models
- Implemented automated data profiling for new data sources
- Created model deprecation process with stakeholder communication workflows

### Analytics Engineering Best Practices
**Model Development**: Git-based workflow with feature branches and code review process
**Testing Strategy**: Test-driven development with tests written before model logic
**Performance Monitoring**: Query performance tracking with automatic optimization recommendations
**Documentation**: Living documentation that updates automatically with model changes

## Business Impact & Stakeholder Enablement

### Finance Analytics
- **Revenue Recognition**: Automated monthly revenue calculations with audit trail
- **Budgeting Models**: Variance analysis and forecast accuracy tracking
- **Cost Allocation**: Activity-based costing models for accurate department attribution
- **Compliance Reporting**: SOX-compliant financial reporting with controlled data lineage

### Marketing Analytics
- **Attribution Modeling**: Multi-touch attribution across 15+ marketing channels
- **Customer Acquisition**: CAC calculation by channel, campaign, and cohort
- **Lifetime Value**: Predictive CLV models informing marketing spend allocation
- **Campaign Performance**: Real-time campaign ROI tracking and optimization recommendations

### Product Analytics
- **User Journey Mapping**: Conversion funnel analysis with statistical significance testing
- **Feature Usage**: A/B test analysis framework for product experimentation
- **Retention Analysis**: Cohort-based retention modeling with churn prediction
- **Product-Market Fit**: Leading indicator metrics for product success

## Technical Challenges & Solutions

### Scale & Performance
**Challenge**: Query performance degradation as data volume grew 10x
**Solution**: Implemented incremental models, materialized views, and query optimization
**Result**: Reduced average query time from 45 seconds to 3 seconds

### Data Source Reliability
**Challenge**: Upstream data quality issues causing model failures
**Solution**: Robust error handling, data validation, and graceful degradation patterns
**Result**: Model success rate improved from 85% to 99.5%

### Cross-Team Collaboration
**Challenge**: Different teams using inconsistent metric definitions
**Solution**: Centralized metrics store with canonical business logic
**Result**: Eliminated "why do these dashboards show different numbers?" discussions

### Computational Cost Management
**Challenge**: Warehouse costs growing 300% with increased usage
**Solution**: Smart scheduling, incremental processing, and query optimization
**Result**: Maintained performance while reducing costs 40% through efficiency gains

## Roadmap & Future Initiatives

### Q4 2025 Goals
- Launch unified metrics catalog with searchable business glossary
- Implement automated model test coverage reporting and quality scoring
- Deploy dbt Cloud for improved collaboration and CI/CD capabilities
- Complete migration from legacy BI tools to standardized Looker platform

### 2026 Strategic Initiatives
- **Semantic Layer**: Implement dbt Semantic Layer for consistent metric calculations
- **ML Integration**: Bridge analytics models with ML feature engineering pipelines
- **Real-Time Models**: Extend dbt to handle streaming data transformations
- **Data Mesh**: Enable domain teams to own their analytical data products

### Innovation Experiments
- **Natural Language Queries**: AI-powered SQL generation for business users
- **Automated Insights**: Machine learning models identifying interesting patterns in data
- **Predictive Analytics**: Statistical models embedded directly in dbt transformations
- **Data Apps**: Interactive applications built on top of dbt model outputs

## Team Performance Metrics

### Technical Excellence
- **Model Reliability**: 99.5% successful daily build rate
- **Test Coverage**: 95% of models have comprehensive test coverage
- **Documentation**: 100% of production models have business documentation
- **Performance**: Average query time under 5 seconds for standard reports

### Business Value
- **Self-Service Adoption**: 400+ business users creating their own analyses
- **Request Fulfillment**: Reduced analytics request backlog by 90%
- **Decision Speed**: Faster access to insights enabling 2x faster business decisions
- **Cost Efficiency**: 40% reduction in warehouse costs through optimization

### Stakeholder Satisfaction
- **User Training**: 200+ stakeholders trained in self-service analytics
- **Knowledge Transfer**: Monthly "Analytics Office Hours" with 100+ attendees
- **Cross-Team Collaboration**: Embedded analytics engineers in product and marketing teams
- **Executive Reporting**: Automated C-level dashboards with 99.9% uptime

