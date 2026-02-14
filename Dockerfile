FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build Next.js app for production
RUN npm run build || true

EXPOSE 3000

# Use next start if build succeeded; fallback to dev for environments without build
CMD ["sh", "-c", "if [ -d .next ]; then npm run start; else npm run dev; fi"]
