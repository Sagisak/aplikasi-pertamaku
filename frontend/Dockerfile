# Start with a multi-stage build
FROM node:20 AS build

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

# Use a new stage for serving the app
FROM nginx:latest

# Copy built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Default command for Nginx
CMD ["nginx", "-g", "daemon off;"]

