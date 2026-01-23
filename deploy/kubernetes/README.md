# Kubernetes Deployment for SDG Innovation Commons

#

# This directory contains Kubernetes manifests for deploying the application to production.

#

# Directory structure:

# - base/ - Base configurations (namespace, secrets, configmaps)

# - storage/ - Persistent volumes and claims

# - services/ - Service definitions

# - deployments/ - Application deployments

# - ingress/ - Ingress configurations

#

# Deployment order:

# 1. kubectl apply -f base/

# 2. kubectl apply -f storage/

# 3. kubectl apply -f deployments/

# 4. kubectl apply -f services/

# 5. kubectl apply -f ingress/

#

# Quick deploy:

# kubectl apply -k deploy/kubernetes/overlays/production

#

# Requirements:

# - Kubernetes cluster (AKS, EKS, GKE, or any K8s cluster)

# - kubectl configured

# - Persistent volume provisioner (for Qdrant and PostgreSQL)

# - Azure PostgreSQL or other managed database service (recommended for production)

#

# Notes:

# - Qdrant MUST use persistent storage to preserve vector data

# - PostgreSQL can be deployed in-cluster or use Azure PostgreSQL (recommended)

# - Secrets should be managed via Azure Key Vault, HashiCorp Vault, or K8s secrets

# - For Azure: Use Azure Disk or Azure Files for persistent volumes

apiVersion: v1
kind: Namespace
metadata:
name: sdg-innovation-commons
labels:
name: sdg-innovation-commons
environment: production
