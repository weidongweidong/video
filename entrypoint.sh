#!/bin/bash

echo "cd /data/api"
#cd /data/api

#echo "npm install"
#npm config set registry "http://registry.npm.taobao.org/"
#npm install

echo "export NODE_ENV=$1 && export NODE_ROUTER=$2 && node server.js"
export NODE_ENV=$1 && export NODE_ROUTER=$2 && node server.js