# Use Node 20 as the base image
FROM node:20

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

# Build the Vue app (optional for dev mode, but necessary for production)
RUN pnpm run build

# Expose the port the Vite app will run on (default is 5173)
EXPOSE 5173

# Start the Vite development server
CMD ["pnpm", "dev", "--host", "0.0.0.0"]  # Use dev to start the Vite server

