# Stage 1: Builder
FROM node:18 as builder
WORKDIR /app
COPY package.json yarn.lock ./
# Install dependencies
RUN yarn install
# Copy source code
COPY . .
# Build the application
RUN yarn build

# Stage 2: Final
FROM node:18-alpine
WORKDIR /app
# Copy dependencies from the builder stage
COPY --from=builder /app/node_modules /app/node_modules
# Copy the built files
COPY --from=builder /app/dist /app/dist
# Expose the port
EXPOSE 3000
# Command to run the application
CMD ["node", "app/dist/main"]
