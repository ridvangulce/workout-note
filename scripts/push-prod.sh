#!/bin/bash

# Load .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | xargs)
fi

# Check if PROD_DATABASE_URL is set
if [ -z "$PROD_DATABASE_URL" ]; then
    echo "Error: PROD_DATABASE_URL is not set in .env file."
    echo "Please add PROD_DATABASE_URL='postgres://...' to your .env file."
    exit 1
fi

echo "🚀 Deploying migrations to PRODUCTION database..."
echo "Target: $PROD_DATABASE_URL"

# Run migrations with the production URL
DATABASE_URL=$PROD_DATABASE_URL npm run db:push

if [ $? -eq 0 ]; then
    echo "✅ Production migration successful!"
else
    echo "❌ Migration failed."
    exit 1
fi
