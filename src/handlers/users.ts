import express from 'express';
import { Users, UserModel } from '../models/users';
import { sign } from 'jsonwebtoken';
import Authorize from '../authorize/jwtAuh';

const store = new UserModel();

const index = async (req: express.Request, res: express.Response) => {
	try {
		Authorize(req);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}
	const user = await store.index();
	res.json(user);
};

const show = async (req: express.Request, res: express.Response) => {
	const id = parseInt(req.params.id);
	if (id === undefined) {
		res.status(400);
		return res.send("Missing or invalid parameters, this endpoint requires the following parameter: id");
	}
	try {
		Authorize(req);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}
	const user = await store.show(id);
	if (user === undefined) {
		res.status(404);
		return res.json("User not found");
	}
	res.json(user);
};

const create = async (req: express.Request, res: express.Response) => {
	const { firstname, lastname, password } = req.body;
	if (firstname === undefined || lastname === undefined || password === undefined) {
		res.status(400);
		return res.send("Missing/Invalid parameters, the following parameter are required: firstname, lastname, password");
	}
	const user: Users = { firstname, lastname, password };
	try {
		const newUser = await store.create(user);
		const token = sign({ user: { id: newUser.id, firstname, lastname } }, process.env.TOKEN_SECRET as string);
		res.json(token);
	} catch (err) {
		res.status(400);
		res.json(String(err) + user);
    }
}



const authenticate = async (req: express.Request, res: express.Response) => {
	const { firstname, lastname, password } = req.body;
	if (firstname === undefined || lastname === undefined || password === undefined) {
		return res.status(400).send("Missing/Invalid parameters, required: firstName, lastName, password");
	}
	const user: Users = { firstname, lastname, password };
	try {
		const u = await store.authenticate(user.firstname, user.lastname, user.password);
		if (u === null) {
			return res.status(401).json("Incorrect user information");
		} else {
			const token = sign({user: {id: u.id, firstname, lastname}}, process.env.TOKEN_SECRET as string);
			res.json(token);
		}
	} catch (err) {
        const e = err as Error;
        return res.status(401).json(e.message);
	}
};


const users_routes = (app: express.Application) => {
    app.get("/users", index);
    app.get("/users/:id", show);
    app.post("/users", create);
    app.post("/users/login", authenticate);
};

export default users_routes; 