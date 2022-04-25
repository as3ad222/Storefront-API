import { Users, UserModel } from "../../models/users";

const userStore = new UserModel();
const userBase: Users = { firstname: "Asaad", lastname: "Mohammed", password: "pass" };
let user: Users;
describe("Testing Model: user", () => {
	it("Must have a create method", () => {
		expect(userStore.create).toBeDefined();
	});

	it("Testing the create model with a user", async () => {
		user = await userStore.create(userBase);
		expect({ firstName: user.firstname, lastname: user.lastname }).toEqual({
			firstName: userBase.firstname,
			lastname: userBase.lastname,
		});
	});

	it("Must have an index method", () => {
		expect(userStore.index).toBeDefined();
	});

	it("Testing the index model to include the user", async () => {
		const users = await userStore.index();
		expect(users).toContain(user);
	});

	it("Must have a show method", () => {
		expect(userStore.show).toBeDefined();
	});

	it("Testing the show model to return the user", async () => {
		const foundUser = await userStore.show(user.id as number);
		expect(foundUser).toEqual(user);
	});
});