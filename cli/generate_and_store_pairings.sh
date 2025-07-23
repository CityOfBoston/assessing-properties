#!/bin/bash
set -e

# Load .env if present
ENV_PATH="$(dirname "$0")/.env"
if [ -f "$ENV_PATH" ]; then
  export $(grep -v '^#' "$ENV_PATH" | xargs)
else
  echo "Error: .env file not found in cli/. Please create cli/.env with your API tokens and project IDs."
  exit 1
fi

# Prompt user for environment selection
echo "Select environment to run generateAndStoreParcelIdAddressPairings:"
echo "1) dev (default)"
echo "2) prd"
read -p "Enter choice [1-2]: " env_choice

if [[ "$env_choice" == "2" ]]; then
  API_TOKEN="$PRD_EXTERNAL_API_TOKEN"
  PROJECT_ID="$PRD_PROJECT_ID"
  ENV_NAME="prd"
  if [ -z "$API_TOKEN" ]; then
    echo "Error: PRD_EXTERNAL_API_TOKEN not set in .env file."
    exit 1
  fi
  if [ -z "$PROJECT_ID" ]; then
    echo "Error: PRD_PROJECT_ID not set in .env file."
    exit 1
  fi
else
  API_TOKEN="$DEV_EXTERNAL_API_TOKEN"
  PROJECT_ID="$DEV_PROJECT_ID"
  ENV_NAME="dev"
  if [ -z "$API_TOKEN" ]; then
    echo "Error: DEV_EXTERNAL_API_TOKEN not set in .env file."
    exit 1
  fi
  if [ -z "$PROJECT_ID" ]; then
    echo "Error: DEV_PROJECT_ID not set in .env file."
    exit 1
  fi
fi

# Set the function URL using PROJECT_ID
FUNCTION_URL="https://us-central1-$PROJECT_ID.cloudfunctions.net/generateAndStoreParcelIdAddressPairings"

# Allow override via env var
if [[ ! -z "$GENERATE_PAIRINGS_URL" ]]; then
  FUNCTION_URL="$GENERATE_PAIRINGS_URL"
fi

echo "Calling generateAndStoreParcelIdAddressPairings on $ENV_NAME..."
echo "POST $FUNCTION_URL"

curl -X POST "$FUNCTION_URL" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}' 