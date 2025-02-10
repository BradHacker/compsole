FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install --global pnpm@latest
WORKDIR /app

FROM base AS build
COPY pnpm-lock.yaml package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . /app
RUN pnpm run build

FROM nginx:stable
COPY --from=build /app/dist /app
COPY ./docker_files/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
