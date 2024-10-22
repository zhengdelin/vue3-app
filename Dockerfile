FROM node:lts-alpine as build-stage

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json (如果存在)
COPY package*.json ./

# 安裝專案依賴
RUN npm install

# 複製專案檔案
COPY . .

# 建構專案
RUN npm run build

# 使用 Nginx 映像
FROM nginx:stable

# 複製 Nginx 配置檔
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 從建構階段複製建構後的檔案到 Nginx 伺服器
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露 80 和 443 端口
EXPOSE 80 443

# 啟動 Nginx 伺服器
CMD ["nginx", "-g", "daemon off;"]
