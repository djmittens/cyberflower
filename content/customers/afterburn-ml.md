---
{
  "id": "afterburn-ml",
  "name": "Afterburn ML",
  "avatar": "assets/avatars/afterburn-ml.svg",
  "members": [
    { "name": "Zoey F", "role": "ML Engineering Lead" },
    { "name": "Adil M", "role": "MLOps Specialist" },
    { "name": "Dr. Elena Rodriguez", "role": "Research Scientist" },
    { "name": "Jake Chen", "role": "ML Engineer" },
    { "name": "Priya Patel", "role": "Data Scientist" },
    { "name": "Alex Kumar", "role": "ML Platform Engineer" }
  ],
  "libraries": [
    { "name": "PyTorch", "project": "Recommendations" },
    { "name": "Feast", "project": "Feature Store" },
    { "name": "MLflow", "project": "Model Management" },
    { "name": "Kubeflow", "project": "ML Pipelines" },
    { "name": "TensorBoard", "project": "Experiment Tracking" },
    { "name": "Ray", "project": "Distributed Training" },
    { "name": "Weights & Biases", "project": "Experiment Management" },
    { "name": "Apache Airflow", "project": "ML Workflow Orchestration" }
  ],
  "meeting_dates": ["2025-08-29", "2025-09-29", "2025-10-27", "2025-11-24"],
  "asks": [
    { "ask": "GPU quota increase (50 V100s)", "due": "2025-09-15", "status": "under-review" },
    { "ask": "Model serving infrastructure", "due": "2025-09-30", "status": "proposed" },
    { "ask": "A100 cluster for LLM training", "due": "2025-10-15", "status": "planned" },
    { "ask": "Feature store scaling budget", "due": "2025-10-30", "status": "under-review" },
    { "ask": "ML monitoring platform", "due": "2025-11-15", "status": "proposed" }
  ],
  "frameworks": ["PyTorch", "TensorFlow", "Scikit-learn"],
  "services": ["Recommendations", "Personalization", "Fraud Detection"],
  "tags": ["ai", "machine-learning", "recommendations", "high-priority"]
}
---

# Afterburn ML Team Overview

The Afterburn ML team is responsible for developing and deploying machine learning models that power personalization, recommendations, and fraud detection across our platform. We serve over 100 million predictions daily with sub-100ms latency requirements.

## Current ML Models in Production

### Recommendation Systems
- **Product Recommendations**: Deep learning model serving 50M daily recommendations
- **Content Personalization**: Multi-armed bandit approach with contextual features  
- **Search Ranking**: Learning-to-rank model with 15% CTR improvement
- **Similar Items**: Collaborative filtering with real-time updates

### Fraud Detection
- **Transaction Anomaly Detection**: Real-time scoring with 99.8% accuracy
- **Account Takeover Prevention**: Behavioral analysis with ensemble models
- **Payment Risk Assessment**: Gradient boosting with feature engineering pipeline

### User Understanding
- **Customer Segmentation**: K-means clustering with 20+ behavioral features
- **Lifetime Value Prediction**: XGBoost model for customer retention
- **Churn Prediction**: Deep neural network with sequential patterns

## Technical Architecture

### Model Serving Infrastructure
- **Real-time Inference**: 50+ models deployed on Kubernetes with auto-scaling
- **Batch Predictions**: Daily scoring jobs processing 10TB of user interaction data
- **A/B Testing Framework**: Statistical significance testing with multi-variate experiments
- **Feature Store**: Low-latency feature serving with 99.99% uptime SLA

### ML Platform Components
- **Training Pipeline**: Automated hyperparameter tuning with Optuna
- **Model Registry**: Versioned model artifacts with automated testing
- **Monitoring System**: Model drift detection and performance alerts
- **Data Pipeline**: Real-time feature computation from streaming events

## Meeting Notes

### August 29, 2025 - Quarterly Planning
- **Q3 Results**: Achieved 12% improvement in recommendation CTR
- **Production Issues**: Resolved latency spikes in fraud detection model
- **New Initiatives**: Starting LLM evaluation for customer support automation
- **Resource Planning**: Projected 300% increase in training compute needs

### Technical Deep Dives
- **Model Performance**: Recommendation model showing signs of drift in mobile segment
- **Infrastructure Scaling**: Current GPU cluster at 95% utilization during peak hours
- **Feature Engineering**: Implementing real-time feature computation for fraud signals
- **Experiment Velocity**: Reduced A/B test duration from 2 weeks to 5 days

## Current Challenges

### Infrastructure Limitations
- **GPU Shortage**: Training queue backlog averaging 48 hours
- **Storage Costs**: Feature store growing 40% monthly, need cost optimization
- **Network Latency**: Cross-region model serving adding 20ms to response times

### Model Development
- **Data Quality**: 15% of training data requires manual cleaning
- **Label Scarcity**: Fraud detection limited by imbalanced dataset
- **Model Complexity**: Balancing accuracy vs interpretability for regulatory compliance

### Operational Challenges
- **On-call Burden**: 3AM alerts for model performance degradation
- **Deployment Complexity**: Manual model validation taking 2 days per release  
- **Knowledge Sharing**: Need better documentation for model handoffs

## Q4 2025 Roadmap

### Model Improvements
1. **Next-Gen Recommendations**: Transformer-based architecture with attention mechanisms
2. **Fraud Detection 2.0**: Real-time graph neural networks for transaction networks
3. **Personalization Engine**: Multi-task learning for unified user understanding
4. **LLM Integration**: Large language models for content generation and summarization

### Platform Enhancements
1. **AutoML Pipeline**: Automated model selection and hyperparameter optimization
2. **Real-time Training**: Online learning for recommendation models
3. **Model Compression**: 10x reduction in model size for edge deployment
4. **Federated Learning**: Privacy-preserving model training across regions

### Infrastructure Goals
1. **GPU Cluster Expansion**: 200 A100 GPUs for large model training
2. **Edge Deployment**: Model serving in 5 geographic regions
3. **Cost Optimization**: 30% reduction in inference costs through model efficiency
4. **Disaster Recovery**: Multi-region failover for critical ML services

## Success Metrics

### Business Impact
- **Revenue Attribution**: $2.5M quarterly revenue from ML recommendations
- **Cost Savings**: $800K saved through automated fraud prevention
- **User Engagement**: 25% increase in session duration from personalization

### Technical Performance
- **Model Accuracy**: 94.5% average across all production models
- **Inference Latency**: 95th percentile under 100ms for all real-time models
- **System Uptime**: 99.97% availability for ML inference services
- **Experiment Velocity**: 15 A/B tests completed monthly

### Team Development
- **Research Publications**: 3 papers accepted at top-tier ML conferences
- **Open Source Contributions**: 5 tools released to ML community
- **Knowledge Sharing**: Monthly tech talks with 200+ attendees
- **Talent Acquisition**: Grown team from 2 to 6 engineers in 12 months

