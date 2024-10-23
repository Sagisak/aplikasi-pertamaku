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

# Copy all files from the context (backend only)
COPY . .

# Install pnpm globally
RUN npm install -g pnpm

# Install backend dependencies using pnpm
RUN pnpm install

# Expose the port the backend app will run on (usually 4000 for Express)
EXPOSE 4000

# Start the backend application using pnpm
CMD ["pnpm", "start"]

