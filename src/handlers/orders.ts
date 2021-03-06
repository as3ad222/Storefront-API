import express from 'express';
import { Order, OrderStore } from '../models/orders';
import Authorize from "../authorize/jwtAuh";

const store = new OrderStore();

const index = async (_req: express.Request, res: express.Response) => {
	const orders = await store.index();
	res.json(orders);
};

const show = async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id);
        if (id === undefined) {
            return res.status(400).send("Missing parameter required id");
        }
        Authorize(req)
        const order = await store.show(id);
        res.send(order);
    } catch (err) {
        const e = err as Error;
        if (e.message.includes("Invalid to get order")) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message)
        }
    }
};

const create = async (req: express.Request, res: express.Response) => {
    try{
        const {user_id, status} = req.body;
        if (user_id === undefined || status === undefined) {
            return res.status(400).send("Missing parameters required: user_id status");
        }
        Authorize(req, user_id)
        const order: Order = {user_id, status};
        const newOrder = await store.create(order);
        res.send(newOrder);
    } catch (err) {
        const e = err as Error;
        if (e.message.includes("Invalid to add order")) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }
};

const addProduct = async (req: express.Request, res: express.Response) => {
    try{
        const orderId = req.params.id;
        const productId = req.body.product_id;
        const quantity = parseInt(req.body.quantity);
        if (orderId === undefined || productId === undefined || quantity === undefined) {
            return res.status(400).send("Missing parameters required: orderId, productId, quantity");
        }
        Authorize(req);
        const addProduct = await store.addProduct(quantity, orderId, productId);
        res.send(addProduct);
    } catch (err) {
        const e = err as Error;
        if (e.message.includes("Invalid to add product")) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }
};

const destroy = async (req: express.Request, res: express.Response) => {
    try{
        const id = req.body.id;
        if (id === undefined) {
            return res.status(400).send("Missing parameters required: id");
        }
        Authorize(req);
        const deleteOrder = await store.delete(id);
        res.send(deleteOrder);
    } catch (err) {
        const e = err as Error;
        if (e.message.includes("Invalid to add product")) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }
};

const order_routes = (app: express.Application) => {
    app.get("/orders", index);
    app.get("/orders/:id", show);
    app.post("/orders", create);
    app.delete("/orders", destroy);
    app.post("/orders/:id/products", addProduct);
};

export default order_routes;