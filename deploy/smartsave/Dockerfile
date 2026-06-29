# Build context: repository root (see deploy/docker-compose.yml)
FROM node:20-alpine AS builder

WORKDIR /app/smartsave

COPY smartsave/package*.json ./
RUN npm ci

COPY smartsave/ ./

ARG VITE_API_BASE_URL
ARG VITE_SUPERADMIN_EMAIL=anjali@ithina.ai
ARG VITE_SUPERADMIN_PASSWORD=SuperAdmin123!

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SUPERADMIN_EMAIL=$VITE_SUPERADMIN_EMAIL
ENV VITE_SUPERADMIN_PASSWORD=$VITE_SUPERADMIN_PASSWORD

RUN npm run build

FROM nginx:1.27-alpine

COPY deploy/smartsave/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/smartsave/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
