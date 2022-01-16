#!/bin/bash

echo "rm -rf /docker-node-servers/hyb-config"
rm -rf /docker-node-servers/hyb-config
echo "cp -a /data/api /docker-node-servers/hyb-config"
cp -a /data/api /docker-node-servers/hyb-config

echo "rm -rf /data/api"
rm -rf /data/api

cd /docker-node-servers/hyb-config


echo "npm install"
npm config set registry "http://registry.npm.taobao.org/"
npm install

echo "export NODE_ENV=$1 && export NODE_ROUTER=$2 && node server.js"
export NODE_ENV=$1 && export NODE_ROUTER=$2 && node server.js