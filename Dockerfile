FROM node:18-alpine

# مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ package files
COPY package*.json ./

# تثبيت المكتبات
RUN npm install

# نسخ باقي المشروع
COPY . .

# فتح المنفذ
EXPOSE 3000

# تشغيل التطبيق
CMD ["npm", "run", "dev"]
