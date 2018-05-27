FROM node:8

USER root

WORKDIR /opt/app-root

COPY . .

RUN apt update -y && \
    apt install -y rsync && \
    npm install -g nodemon && \
    npm install && \
    npm run build && \
    chgrp -R 0 /opt/app-root && \
    chmod -R g=u /opt/app-root

EXPOSE 8080

USER 1001

ENTRYPOINT ["nodemon"]