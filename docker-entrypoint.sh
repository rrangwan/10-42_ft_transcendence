#!/bin/sh

set -e  # Exit immediately if a command exits with a non-zero status

# Wait for the database to be ready
until pg_isready -h $DB_HOST -U $POSTGRES_USER; do
  echo "Waiting for database..."
  sleep 2
done

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Start the Django server
echo "Starting server..."
exec "$@"
