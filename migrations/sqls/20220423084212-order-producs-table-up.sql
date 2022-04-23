CREATE TABLE IF EXISTS order_products(
    id SERIAL PRIMARY KEY,
    quantity INTEGER,
    order_id BIGINT,
    product_id BIGINT REFERENCES products(id)
);

ALTER TABLE order_products ADD FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;