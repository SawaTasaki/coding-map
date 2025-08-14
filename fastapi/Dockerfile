FROM python:3.12-slim

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./fastapi_app /app/fastapi_app

# CMD で指定したコマンドは、上記のインストールなどが終わってから実行される
# RUN で指定するとインストール完了を待たずに実行されてしまう
CMD ["uvicorn", "fastapi_app.main:app", "--host", "0.0.0.0", "--port", "80", "--reload", "--proxy-headers"]
