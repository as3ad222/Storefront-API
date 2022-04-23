CREATE TABLE IF EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(100),
    user_id bigint NOT NULL REFERENCES users(id)
);