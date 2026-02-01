#!/bin/sh
envsubst '${BACKEND_URI}' < /usr/share/nginx/html/environments/env.template.js > /usr/share/nginx/html/environments/env.js

exec nginx -g 'daemon off;'
