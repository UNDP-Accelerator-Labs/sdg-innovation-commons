# Base image - using Debian for better canvas support
FROM node:20 AS base
WORKDIR /app

ENV NODE_ENV=production
ENV COREPACK_DEFAULT_TO_LATEST=0

# Install canvas dependencies for Debian
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod=false

# Copy the rest of the application code
COPY . .

# Build the project
RUN pnpm run build

# Production image - using Debian
FROM node:20-slim AS runner
WORKDIR /app

# Install canvas runtime AND build dependencies for Debian
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libcairo2 \
    libpango-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    python3 \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Copy package files first
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy node_modules
COPY --from=base /app/node_modules ./node_modules

# Force rebuild canvas for the target architecture by removing old build
RUN rm -rf node_modules/.pnpm/canvas@*/node_modules/canvas/build && \
    cd node_modules/.pnpm/canvas@*/node_modules/canvas && \
    node-gyp rebuild || npm run install

# Copy built assets and required files
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/scripts ./scripts
COPY --from=base /app/app/lib ./app/lib

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use Next.js start command
CMD ["npm", "run", "start"]