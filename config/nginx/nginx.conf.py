# Usage: python nginx.conf.py [user] [group] [nginx_prefix] [mingl_root]

user = 'root',
group = 'staff',
prefix = '/opt/local',
mingl = '/Users/andrew/Sites/mingl'

import sys
if len(sys.argv) > 1:
    (user, group, prefix, mingl) = sys.argv[1:]

print """
# user {user} {group};
worker_processes 1;

error_log {prefix}/var/log/nginx/error.log;
pid {prefix}/var/run/nginx.pid;

events {{
    worker_connections 1024;
}}

http {{
    # Enumerate all the frontend servers here
    upstream frontends {{
        server 127.0.0.1:8000;
        #server 127.0.0.1:8001;
        #server 127.0.0.1:8002;
        #server 127.0.0.1:8003;
    }}

    include {prefix}/etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log {prefix}/var/log/nginx/access.log;

    keepalive_timeout 65;
    proxy_read_timeout 200;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    gzip on;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_types text/plain text/html text/css text/xml
               application/x-javascript application/xml
               application/atom+xml text/javascript;

    # Only retry if there was a communication error
    proxy_next_upstream error;

    server {{
        listen 8080;

        # Allow file uploads
        client_max_body_size 10M;

        location ^~ /api/ {
            proxy_pass_header Server;
            proxy_set_header Host $http_host;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Scheme $scheme;
            proxy_pass http://frontends;
        }

        location = / {
            rewrite (.*) /base.html;
        }

        location ^~ / {
            root /Users/andrew/Sites/mingl/build/client/;
            # expires max;
        }
    }}
}}""".format(
    user=user,
    group=group,
    prefix=prefix,
    mingl=mingl
)
 
