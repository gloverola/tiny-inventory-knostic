.PHONY: dev
dev: ## Run both server and spa projects locally using Docker
	docker compose -f docker-compose.yml up --build --remove-orphans