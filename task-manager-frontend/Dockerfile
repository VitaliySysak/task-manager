# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps 
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VITE_GIT_HASH
ARG VITE_API_URL
ARG VITE_GOOGLE_AUTH_URL
ENV VITE_GIT_HASH=$VITE_GIT_HASH
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_AUTH_URL=$VITE_GOOGLE_AUTH_URL
RUN npm run build

FROM nginx:alpine AS production
RUN adduser -D -S -u 1001 reactjs
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
RUN chown -R reactjs /var/cache/nginx && \
    chown -R reactjs /var/log/nginx && \
    chown -R reactjs /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R reactjs /var/run/nginx.pid
USER reactjs
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
CMD ["/bin/sh", "-c", "envsubst '${VITE_DOMAIN_NAME}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]