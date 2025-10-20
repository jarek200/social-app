#!/bin/bash

# Setup script for local DynamoDB tables

echo "🚀 Setting up local DynamoDB tables..."

AWS_ENDPOINT="http://localhost:8000"
AWS_REGION="eu-west-2"

# Create Posts table
echo "Creating Posts table..."
aws dynamodb create-table \
  --table-name Posts \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
    AttributeName=owner,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=ByOwner,KeySchema=[{AttributeName=owner,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --endpoint-url $AWS_ENDPOINT \
  --region $AWS_REGION \
  2>/dev/null || echo "Posts table already exists"

# Create Comments table
echo "Creating Comments table..."
aws dynamodb create-table \
  --table-name Comments \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=postId,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=ByPost,KeySchema=[{AttributeName=postId,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --endpoint-url $AWS_ENDPOINT \
  --region $AWS_REGION \
  2>/dev/null || echo "Comments table already exists"

# Create Likes table
echo "Creating Likes table..."
aws dynamodb create-table \
  --table-name Likes \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=postId,AttributeType=S \
    AttributeName=owner,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=ByPost,KeySchema=[{AttributeName=postId,KeyType=HASH},{AttributeName=owner,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --endpoint-url $AWS_ENDPOINT \
  --region $AWS_REGION \
  2>/dev/null || echo "Likes table already exists"

echo "✅ Local DynamoDB tables created successfully!"
echo ""
echo "📊 Access DynamoDB Admin UI at: http://localhost:8001"
echo "🔌 DynamoDB endpoint: http://localhost:8000"

