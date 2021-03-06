import express from 'express';
import { Product, ProductStore } from "../models/products";
import Authorize from "../authorize/jwtAuh";

const store = new ProductStore();

const index = async (req: express.Request, res: express.Response) => {
        const product = await store.index();
        res.send(product);
    
};

const show = async (req: express.Request, res: express.Response) => {
    try{
        const id = parseInt(req.params.id);
        if (id === undefined) {
            return res.status(400).send("Missing parameters, id required");
        }
        Authorize(req);
        const product = await store.show(id);
        res.send(product);
    } catch (err) {
        const e = err as Error;
        if (e.message.includes("Invalid to get product")) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }
};

const create = async (req: express.Request, res: express.Response) => {
    try{
        const {name, price, category } = req.body;
        if (name === undefined || price === undefined || category === undefined) {
            return res.status(400).send(" invalid parameters required : name, price, category");
        }
        Authorize(req);
        const product: Product = {name, price, category};
        const newProduct = await store.create(product);
        res.send(newProduct);
    } catch (err) {
        const e = err as Error;
        if (e.message.includes("Invalid to add product")) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }
};

const products_routes = (app: express.Application) => {
    app.get("/products", index);
    app.get("/products/id", show);
    app.post("/products", create);
};

export default products_routes;