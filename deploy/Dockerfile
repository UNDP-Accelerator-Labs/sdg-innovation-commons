# Base image
FROM node:20-alpine AS base
WORKDIR /app

ENV NODE_ENV=production
ENV COREPACK_DEFAULT_TO_LATEST=0

RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod=false

# Copy the rest of the application code
COPY . .

# Build the project
RUN pnpm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Install canvas dependencies (both build-time and runtime)
RUN apk add --no-cache \
    cairo \
    cairo-dev \
    pango \
    pango-dev \
    jpeg \
    jpeg-dev \
    pixman \
    pixman-dev \
    giflib \
    giflib-dev \
    librsvg \
    python3 \
    make \
    g++

RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets and required files
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=base /app/scripts ./scripts
COPY --from=base /app/app/lib ./app/lib

# Rebuild canvas for this environment
RUN pnpm rebuild canvas

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use Next.js start command
CMD ["npm", "run", "start"]