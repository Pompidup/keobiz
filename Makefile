.PHONY: docker-start docker-stop docker-restart

docker-start:
	docker compose up -d

docker-stop:
	docker compose down --rmi all

docker-restart: docker-stop docker-start

duplicate:
	docker compose exec app sh -c "npm run duplicate"