#!/bin/sh

echo "Starting Vikunja Status Page..."

if [ -f /app/.env ]; then
    echo "Found .env file at /app/.env. Loading..."
    # Use set -a to automatically export variables
    set -a
    . /app/.env
    set +a
else
    echo "No .env file found at /app/.env. Using existing environment variables."
fi

echo "Generating runtime configuration..."
echo "window.env = {" > /usr/share/nginx/html/config.js

# Iterate over environment variables starting with VITE_
env | grep '^VITE_' | while read -r line; do
    key=$(echo "$line" | cut -d '=' -f 1)
    value=$(echo "$line" | cut -d '=' -f 2-)
    # Escape double quotes in value
    value=$(echo "$value" | sed 's/"/\\"/g' | tr -d '\n')
    echo "  $key: \"$value\"," >> /usr/share/nginx/html/config.js
done

echo "};" >> /usr/share/nginx/html/config.js

echo "Configuration generated:"
cat /usr/share/nginx/html/config.js

echo "Starting Nginx on port 3030..."
exec nginx -g "daemon off;"
