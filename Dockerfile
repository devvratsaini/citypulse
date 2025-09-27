# ---- Stage 1: Dependency Installation ----
# Use a specific Node.js version on a lean 'alpine' base image
FROM node:18-alpine AS deps
# Set the working directory inside the container
WORKDIR /app
# Copy only the package files to leverage Docker's layer caching
COPY package.json package-lock.json ./
# Install production dependencies
RUN npm install --omit=dev

# ---- Stage 2: Application Build ----
FROM node:18-alpine AS builder
WORKDIR /app
# Copy dependencies from the previous stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application source code
COPY . .

# This build argument is a secure way to pass secrets during the build process
ARG NEXT_PUBLIC_ORS_API_KEY
# Set the environment variable for the build command
ENV NEXT_PUBLIC_ORS_API_KEY=$NEXT_PUBLIC_ORS_API_KEY

# Run the Next.js production build command
RUN npm run build

# ---- Stage 3: Production Image ----
# This is the final, lean image that will be deployed
FROM node:18-alpine AS runner
WORKDIR /app
# Set the environment to production to enable Next.js optimizations
ENV NODE_ENV=production

# Copy the optimized, standalone output from the builder stage
# This creates a much smaller final image than copying the entire project
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# The application will run on port 3000 inside the container
EXPOSE 3000
ENV PORT=3000

# The command to start the optimized Next.js server
CMD ["node", "server.js"]