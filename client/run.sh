#!/bin/sh
echo "The BACKEND_URI is: $BACKEND_URI"

envsubst '${BACKEND_URI}' < /usr/share/nginx/html/environments/env.template.js > /usr/share/nginx/html/environments/env.js

exec nginx -g 'daemon off;'
