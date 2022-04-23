import express from 'express';
import { Users, UserModel } from '../models/users';
import {Verify, Sign} from '../authorize/jwtAuh';

const store = new UserModel();

const index = async (req: express.Request, res: express.Response) => {
    try {
        Verify(req);
        const users = await store.index();
        res.send(users);
     } catch (err) {
         const e = err as Error;
         if (e.message.includes("Invalid get user")){
             res.status(500).json(e.message);
         } else {
             res.status(401).json(e.message);
         }
     }
};

const show = async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id);
        if (id === undefined) {
            return res.status(400).send("Missing or invalid parameters,  id required");
        }
        Verify(req, id);
        const user = await store.show(id);
        res.send(user);
    } catch (err) {
        const e = err as Error;
        if (e.message.includes('Invalid to get user')){
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }
};

const create = async (req: express.Request, res: express.Response) => {
    try {
      const { firstName, lastName, password } = req.body;
      if (firstName === undefined || lastName === undefined|| password === undefined) {
        return res.status(400).send('Error, missing parameters. firstName, lastName, password required');
      }
      const user: Users = { firstName, lastName, password };
      const newUser = await store.create(user);
      const token = Sign( Number(newUser.id));
      res.send(token);
    } catch (error) {
      const e = error as Error;
      if (e.message.includes('Failed to add the user')) {
        res.status(500).json(e.message);
      } else {
        res.status(401).json(e.message);
      }
    }
  };
  

  const update = async (req: express.Request, res: express.Response) => {
      try {
        const { id, firstName, lastName, password } = req.body;
        if (id === undefined || firstName === undefined || lastName === undefined || password === undefined) {
            return res.status(400).send("Missing/Invalid parameters, required: id, firstName, lastName, password"
            );
        }
        Verify(req, id);
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
    Verify(req, id);
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
			const token = Sign(Number(user.id));
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