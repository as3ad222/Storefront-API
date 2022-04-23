CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    firstName varchar(100),
    lastName varchar(100),
    password varchar
);