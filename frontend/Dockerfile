# Production image for the SvelteKit frontend (adapter-node).
# No env vars are needed at build time; STRAPI_URL and STRAPI_READ_API_KEY
# are read at runtime from the container environment.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/build ./build
COPY package.json ./
USER node
EXPOSE 3000
CMD ["node", "build"]
