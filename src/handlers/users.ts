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
	const { firstName, lastName, password } = req.body;
	if (firstName === undefined || lastName === undefined || password === undefined) {
		res.status(400);
		return res.send("Missing/Invalid parameters, the following parameter are required: firstName, lastName, password");
	}
	const user: Users = { firstName, lastName, password };
	try {
		const newUser = await store.create(user);
		const token = sign({ user: { id: newUser.id, firstName, lastName } }, process.env.TOKEN_SECRET as string);
		res.json(token);
	} catch (err) {
		res.status(400);
		res.json(String(err) + user);
    }
}

const update = async (req: express.Request, res: express.Response) => {
      try {
        const { id, firstName, lastName, password } = req.body;
        if (id === undefined || firstName === undefined || lastName === undefined || password === undefined) {
            return res.status(400).send("Missing/Invalid parameters, required: id, firstName, lastName, password"
            );
        }
        Authorize(req, id);
        const user: Users = {id, firstName, lastName, password};
        const updated = await store.update(user);
        res.send(updated);
      } catch (err) {
          const e = err as Error;
          if (e.message.includes('failed update user')) {
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
		return res.status(400).send("Missing/Invalid parameters, required: id");
	}
    Authorize(req, id);
    const deletedUser = await store.delete(id);
    res.send(deletedUser);
		if (deletedUser === undefined) {
			res.status(404);
			return res.json("User doesn't exist");
        }
	} catch (err) {
        const e =err as Error;
        if (e.message.includes("Could't delete user")) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }
};

const authenticate = async (req: express.Request, res: express.Response) => {
	const { firstName, lastName, password } = req.body;
	if (firstName === undefined || lastName === undefined || password === undefined) {
		return res.status(400).send("Missing/Invalid parameters, required: firstName, lastName, password");
	}
	const user: Users = { firstName, lastName, password };
	try {
		const u = await store.authenticate(user.firstName, user.lastName, user.password);
		if (u === null) {
			return res.status(401).json("Incorrect user information");
		} else {
			const token = sign({user: {id: u.id, firstName, lastName}}, process.env.TOKEN_SECRET as string);
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
    app.put("/users", update);
    app.post("/users", create);
    app.delete("/users", destroy);
    app.post("/users/login", authenticate);
};

export default users_routes; 