import client from "../database";

export type Product = {
    id?: number;
    name: string;
    price: number;
    category: string;
};

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const connect = await client.connect();
            const sql = "SELECT * FROM products";
            const result = await connect.query(sql);
            connect.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could't to get product, ${err}`);
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const connect = await client.connect();
            const sql = "SELECT * FROM products WHERE id=($1)";
            const result = await connect.query(sql, [id]);
            connect.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could't get to products ${id}, ${err}`);
        }
    }

    async create(product: Product): Promise<Product> {
        try{
            const connect = await client.connect();
            const sql = "INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *";
            const result = await connect.query(sql, [product.name, product.price, product.category]);
            connect.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create to products ${product}, ${err}`);
        }
    }
}