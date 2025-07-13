FROM node:24-alpine3.21
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g wait-port

# Remove all npx commands from build steps
# Only build dependencies and copy code

# Build the application
RUN npm run build

# At container startup, wait for Postgres, run migrations, generate Prisma client, then start the app
ENTRYPOINT ["sh", "./entrypoint.sh"]