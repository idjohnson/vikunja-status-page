#!/bin/sh
# Generate runtime config from environment variables

cat > /app/dist/config.js <<EOF
window.RUNTIME_CONFIG = {
  VITE_VIKUNJA_API_URL: "${VITE_VIKUNJA_API_URL}",
  VITE_VIKUNJA_API_TOKEN: "${VITE_VIKUNJA_API_TOKEN}"
};
EOF
