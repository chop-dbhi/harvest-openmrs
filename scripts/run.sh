#!/bin/bash

APP_DIR=/opt/app/

cd $APP_DIR

make setup
make collect

python /opt/app/bin/manage.py syncdb --noinput
python /opt/app/bin/manage.py migrate --noinput

python /opt/app/bin/manage.py runserver 0.0.0.0:8000
