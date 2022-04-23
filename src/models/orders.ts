import client from "../database";

export type Order = {
    id?: number;
    status : string;
    items?: [] | [null];
    user_id: string;
};

export class OrederStore{
    async index(): Promise<Order[]> {
        try{
            const connect = await client.connect();
            const sql = `SELECT orders.*,
            array_agg(row_to_json(order_products)) AS items
            FROM orders
            FULL JOIN order_products ON orders.id = order_products.order_id
            GROUP BY orders.id`;
            const result = await client.query(sql);
            connect.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could't get orders , ${err}`);
        }
    }

    async show (id: number): Promise<Order> {
        try {
            const connect = await client.connect();
            const sql = "SELECT * FROM orders WHERE id =($1)";
            const result = await connect.query(sql, [id]);
            connect.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not get order ${id}, ${err}`);
        }
    }

    async create(order : Order): Promise<Order> {
        try{
            const connect = await client.connect();
            const sql = "INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *";
            const result = await connect.query(sql, [order.status, order.user_id]);
            connect.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could't create order ${order}, ${err}`);
        }
    }

    async update(order: Order): Promise<Order> {
        try {
            const connect = await client.connect();
            const sql = "UPDATE order SET status=($2) WHERE id=($1) RETURNING *";
            const result = await connect.query(sql, [order.id, order.status]);
            connect.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could't update product ${order.id}, ${err}`);
        }
    }

    async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {
        try {
            const connect = await client.connect();
            const sql = `INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *`;
            const result = await connect.query(sql, [quantity, orderId, productId]);
            connect.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`);
        }
    }

        async delete(id: number): Promise<Order> {
            try{
                const connect = await client.connect();
                const sql = "DELETE from orders WHERE id =($1) RETURNING *";
                const result = await connect.query(sql, [id]);
                connect.release();
                return result.rows[0];
            } catch (err) {
                throw new Error(`Could't delete order ${id}, ${err}`);
            }
        
    }
}