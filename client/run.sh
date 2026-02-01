#!/bin/sh
echo "The BACKEND_URI is: $BACKEND_URI"

envsubst '${BACKEND_URI}' < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

ls -R /usr/share/nginx/html

exec nginx -g 'daemon off;'
