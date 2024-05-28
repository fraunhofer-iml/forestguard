FROM docker.io/nginxinc/nginx-unprivileged

ARG APP

USER root
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY ./dist/apps/${APP}/browser/ /usr/share/nginx/html/

USER nginx
EXPOSE 8080:8080
CMD ["/bin/sh",  "-c",  "exec nginx -g 'daemon off;'"]
