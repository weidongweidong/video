FROM node:8.9.0

RUN mkdir -p /data/api


COPY ./ /data/api

RUN mkdir /data/api/logs


# 删除包再重新拷贝
RUN rm -f /data/api/package.json
COPY ./package.json /data/api/package.json

# 工作目录
WORKDIR /data/api/

# 安装node包
RUN npm config set registry "http://registry.npm.taobao.org/"
RUN npm install

RUN chmod a+x /data/api/entrypoint.sh

#修改docker时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai  /etc/localtime

EXPOSE 3200

CMD ./entrypoint.sh dev web


