# Stage 1: Build the Vue app
FROM node:20 AS builder

# Define build arguments
ARG STUDENT_NAME
ARG STUDENT_NIM

# Set environment variables using the build arguments
ENV NUXT_STUDENT_NAME=${STUDENT_NAME}
ENV NUXT_STUDENT_NIM=${STUDENT_NIM}

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install frontend dependencies using pnpm
RUN pnpm install

# Copy the rest of the application files
COPY . .

# Build the Vue app
RUN pnpm run build

# Stage 2: Create the final image with Nginx
FROM nginx:latest

# Copy the built Vue app to the Nginx directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

