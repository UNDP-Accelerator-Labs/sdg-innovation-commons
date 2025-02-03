# Base image
FROM node:20-alpine AS base
WORKDIR /app

# Install corepack and enable it
RUN corepack enable

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the project
RUN pnpm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets and required files
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use Next.js start command
CMD ["npm", "run", "start"]