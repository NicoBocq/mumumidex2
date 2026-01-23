.PHONY: start stop logs db-push db-studio

# Démarre la base de données PostgreSQL locale
start:
	docker compose up -d

# Arrête la base de données
stop:
	docker compose down

# Affiche les logs
logs:
	docker compose logs -f postgres

# Pousse le schéma Prisma vers la base locale
db-push:
	bunx prisma db push

# Ouvre Prisma Studio
db-studio:
	bunx prisma studio
