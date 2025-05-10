#!/bin/sh

echo "Ожидание СУБД..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "Запуск миграций..."
pnpm typeorm migration:run

echo "Запуск приложения..."
pnpm start:prod 
