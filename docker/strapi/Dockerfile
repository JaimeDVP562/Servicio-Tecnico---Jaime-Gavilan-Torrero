FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install global dependencies
RUN npm install -g @strapi/strapi@latest

# Create Strapi application if it doesn't exist
RUN if [ ! -f "package.json" ]; then \
  strapi new . --quickstart --no-run --skip-cloud; \
  fi

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 1337

# Set environment
ENV NODE_ENV=development

# Start command
CMD ["npm", "run", "develop"]