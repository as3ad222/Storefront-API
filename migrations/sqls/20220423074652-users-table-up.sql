CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    firstname varchar(100),
    lastname varchar(100),
    password varchar
);