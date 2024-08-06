

ARG NODE_VERSION=22.3.0
ARG PNPM_VERSION=9.6.0

FROM node:${NODE_VERSION}-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as build

WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

################################################################################
# parte final
FROM nginxinc/nginx-unprivileged:alpine3.19-perl as final

ENV NODE_ENV production
COPY --link ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --link --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE ${PORT}

CMD ["nginx", "-g", "daemon off;"]
