import supertest from "supertest";
import app from "../../index";
import { JwtPayload, verify } from "jsonwebtoken";
import{Users} from "../../models/users";

const request = supertest(app);

describe("Test Endpoint /users", () => {
	const user: Users = { firstName: "Asaad", lastName: "Mohammed", password: "Pass" };
	let token: string;
	let userId: string;
	it("Testing the create endpoint", async () => {
		await request
			.post("/users")
			.send(user)
			.expect(200)
			.then((res) => {
				token = res.body;
				const decodedJWT = verify(token as string, process.env.TOKEN_SECRET as string) as JwtPayload;
				userId = decodedJWT.user.id;
			});
	});

	it("Test index endpoint with valid token", async () => {
		await request.get("/users").set("Authorization", `Bearer ${token}`).expect(200);
	});

	it("Test index endpoint with invalid token", async () => {
		await request.get("/users").set("Authorization", "Bearer faketoken").expect(401);
	});

	it("Test read endpoint with valid token and valid user ID", async () => {
		await request.get(`/users/${userId}`).set("Authorization", `Bearer ${token}`).expect(200);
	});

	it("Test read endpoint with valid token and invalid user ID", async () => {
		await request.get("/users/999").set("Authorization", `Bearer ${token}`).expect(404);
	});

	it("Test read endpoint with invalid token and invalid user ID", async () => {
		await request.get("/users/999").set("Authorization", "Bearer faketoken").expect(401);
	});

	it("Test update endpoint with different user ID", async () => {
		await request
			.put("/users")
			.set("Authorization", `Bearer ${token}`)
			.send({ id: 999, firstName: user.firstName, lastName: user.lastName, password: user.password })
			.expect(401);
	});

	it("Testing the delete endpoint with valid token and invalid user ID", async () => {
		await request.delete("/users").set("Authorization", "Bearer faketoken").send({ id: 999 }).expect(401);
	});
	it("Testing the delete endpoint with valid token and valid user ID", async () => {
		await request.delete("/users").set("Authorization", `Bearer ${token}`).send({ id: userId }).expect(200);
	});
});