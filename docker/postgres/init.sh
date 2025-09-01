#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE user_service;
    CREATE DATABASE chat_service;
    CREATE DATABASE media_service;
    CREATE DATABASE notification_service;
    CREATE DATABASE post_service;
EOSQL