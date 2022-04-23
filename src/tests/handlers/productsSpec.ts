import supertest from "supertest";
import app from "../../index";
import { Users } from "../../models/users";
import { Product } from "../../models/products";

const request = supertest(app);

describe("Testing Endpoint: /products", () => {
	const product: Product = { name: "tomato", price: 25, category: "fruits" };
	let productId: string;
	let token: string;
	beforeAll(async () => {
		const user: Users = { firstName: "Asaad", lastName: "Mohammed", password: "Pass" };
		await request
			.post("/users")
			.send(user)
			.expect(200)
			.then((res) => {
				token = res.body;
			});
	});

	it("Testing the create endpoint with an invalid token", async () => {
		await request.post("/products").send(product).set("Authorization", "Bearer faketoken").expect(401);
	});

	it("Testing the read endpoint with invalid product ID", async () => {
		await request.get("/products/999").set("Authorization", `Bearer ${token}`).expect(404);
	});

    it("Testing the delete endpoint with valid token and invalid Product ID", async () => {
		await request.delete("/products").set("Authorization", "Bearer faketoken").send({ id: 999 }).expect(401);
	});
});