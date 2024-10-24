# Stage 1: Build the Vue.js application
# Use Node 20 as the base image for building the app
FROM node:20 AS builder

# Define build arguments
ARG STUDENT_NAME
ARG STUDENT_NIM

# Set environment variables using the build arguments
ENV NUXT_STUDENT_NAME=${STUDENT_NAME}
ENV NUXT_STUDENT_NIM=${STUDENT_NIM}

# Set the working directory
WORKDIR /app

# Copy all files from the context (frontend only)
COPY . .

# Install pnpm globally
RUN npm install -g pnpm

# Install frontend dependencies using pnpm
RUN pnpm install

# Build the Vue app
RUN pnpm run build

# Stage 2: Serve the app with Nginx
# Use Nginx as the base image for serving the app
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default port for Nginx
EXPOSE 80

# Start Nginx (default command for Nginx)
CMD ["nginx", "-g", "daemon off;"]

