#!/bin/bash

killall -9 nginx uwsgi
echo 'kill nginx uwsgi'
nginx
echo 'start nginx'
uwsgi --plugin python -x djangochina_socket.xml
echo 'start uwsgi'
