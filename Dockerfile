FROM node:18-alpine

WORKDIR /app

# Dependencies install karne ke liye package files copy karo
COPY package*.json ./
RUN npm install

# Poora application code copy karo
COPY . .

# Ports expose karo (Frontend aur Backend dono ke liye)
EXPOSE 5173 5000

# App start karne ki command
CMD ["npm", "run", "dev"]