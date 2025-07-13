#!/bin/sh
set -e

echo "Waiting for Postgres to be ready..."
wait-port postgres:5432

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Generating Prisma client..."
npx prisma generate

echo "Starting backend API..."
npm run start