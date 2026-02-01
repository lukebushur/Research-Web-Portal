#!/bin/sh
envsubst '${BACKEND_URI}' < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js

exec nginx -g 'daemon off;'
