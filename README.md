# React + FastAPI + PostgreSQL Template

このリポジトリは、React（フロントエンド）、FastAPI（バックエンド）、PostgreSQL（データベース）を使った掲示板アプリのテンプレートです。

## 📦 使用技術

- Frontend: React + Vite + TypeScript
- Backend: FastAPI
- DB: PostgreSQL
- 開発環境: Docker Compose
- コード品質ツール: ESLint + Prettier

## 🚀 起動方法

```bash
make build-up
```

## 📝 .env

```bash
FRONTEND_ORIGIN=http://localhost:5173
VITE_BACKEND_ORIGIN=http://localhost:8000

POSTGRES_USER=my_user
POSTGRES_PASSWORD=my_password
POSTGRES_HOST=postgresql
POSTGRES_PORT=5432
POSTGRES_DB=my_db

POSTGRESQL_CONTAINER=postgresql
REACT_CONTAINER=react
FASTAPI_CONTAINER=fastapi
```
