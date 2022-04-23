import express from "express";

const app = express();
const port = process.env.PORT || 3000;


app.get('/', (req: express.Request, res: express.Response)=>{
    res.send("Welcome to Storefront_API");
});

app.listen(port, ()=>{
    console.log(`start server on port ${port}`);
});

export default app;


