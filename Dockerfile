FROM node:18-slim

WORKDIR /app
EXPOSE 5173

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the development server port (default is 5173 for Vite)
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev", "--", "--host"]
