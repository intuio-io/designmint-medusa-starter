FROM node:20-alpine

WORKDIR /admin

# Install required system dependencies
RUN apk add --no-cache python3 make g++ postgresql-client

# Clean any existing node_modules and build folders
RUN rm -rf node_modules

# Install dependencies
COPY package.json ./

RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Expose port
EXPOSE 9000

# Use a direct command instead of a script file
CMD ["sh", "-c", "echo \"DATABASE_URL=$DATABASE_URL\nREDIS_URL=$REDIS_URL\nJWT_SECRET=$JWT_SECRET\nCOOKIE_SECRET=$COOKIE_SECRET\nMEDUSA_ADMIN_ONBOARDING_TYPE=$MEDUSA_ADMIN_ONBOARDING_TYPE\nSTORE_CORS=$STORE_CORS\nADMIN_CORS=$ADMIN_CORS\nAUTH_CORS=$AUTH_CORS\nMEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=$MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY\nMEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL\nVITE_BACKEND_URL=$VITE_BACKEND_URL\" > .env && npx medusa db:create && npx medusa db:migrate && npm run seed && npx medusa user --email admin@medusa.com --password supersecret && PGPASSWORD=postgres psql -h postgres -U postgres -d medusa-docker -c \"UPDATE api_key SET token = 'pk_4849f2d741d03b7a93feed52973f2d2c49a84a44208e2bea39aaca571d8e4d46' WHERE id = (SELECT id FROM api_key LIMIT 1);\" && npm run start"]