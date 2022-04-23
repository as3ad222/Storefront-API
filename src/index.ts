import express from "express";
import order_routes from "./handlers/orders";
import products_routes from "./handlers/products";
import users_routes from "./handlers/users";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: express.Request, res: express.Response)=>{
    res.send("Welcome to Storefront_API");
});

order_routes(app);
products_routes(app);
users_routes(app);

app.listen(port, ()=>{
    console.log(`start server on port ${port}`);
});

export default app;