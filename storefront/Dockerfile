FROM node:20-alpine

WORKDIR /app/storefront

# Install required system dependencies
RUN apk add --no-cache python3 make g++

# Clean any existing node_modules and build folders
RUN rm -rf node_modules .next

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy project files
COPY . .

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 8000

# Start Next.js in prod mode
CMD ["sh", "-c", "npm run build && npm run start"]