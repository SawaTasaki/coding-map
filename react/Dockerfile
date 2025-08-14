FROM node:22-alpine

WORKDIR /app

COPY package*.json /app
RUN npm install

COPY . /app

EXPOSE 5173

# CMD で指定したコマンドは、上記のインストールなどが終わってから実行される
# RUN で指定するとインストール完了を待たずに実行されてしまう
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
