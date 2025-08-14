include .env
export

build-up:
	docker compose build
	docker compose up -d
	docker ps

up:
	docker compose up -d

down:
	docker compose down

clean:
	docker system df
	docker system prune -a -f
	@if [ "`docker volume ls -q`" != "" ]; then \
		docker volume rm `docker volume ls -q`; \
	else \
		echo "[WARN] No Docker volumes to remove."; \
	fi
	docker system df

postgresql:
	docker exec -it $(POSTGRESQL_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "\l"
	docker exec -it $(POSTGRESQL_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "\dt"
	docker exec -it $(POSTGRESQL_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "SELECT * FROM post;"
	docker exec -it $(POSTGRESQL_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

react:
	docker exec -it $(REACT_CONTAINER) sh

lint:
	docker exec -it $(REACT_CONTAINER) npm run lint

format:
	docker exec -it $(REACT_CONTAINER) npm run format

fastapi:
	docker exec -it $(FASTAPI_CONTAINER) sh
