# Use Node 20 as the base image for building the Vue app
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

# Build the Vue app (for production)
RUN pnpm run build

# Use an Nginx base image to serve the built static files
FROM nginx:1.27.2

# Copy the built Vue app from the previous stage to the Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy your custom Nginx configuration if needed (optional)
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

