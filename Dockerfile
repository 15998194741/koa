# Dockerfile
# 使用node做为镜像 docker pull node:10.19.0-alpine3.9
FROM node:10.19.0-alpine3.9
# 在容器中创建该目录
RUN mkdir -p /web/project
RUN mkdir -p /web/system_file
# 设置容器的工作目录为该目录
WORKDIR /web/project
# 向外提供3000端口
EXPOSE 8601
# 容器创建完成后执行的命令
RUN npm install pm2 -g --registry https://registry.npm.taobao.org
CMD npm install --registry=https://registry.npm.taobao.org && pm2-runtime start pm2.json
# 运行：
# docker build --rm --no-cache=true -t wp-server-v1 - < Dockerfile
# docker run -d --privileged=true --name wp-server-v1 -p 8601:8601 -v /root/jenkins_node1/workspace/wp-beta-1:/web/project wp-server-v1


