import { Users, UserModel } from "../../models/users";

const userStore = new UserModel();
const userBase: Users = { firstName: "R2", lastName: "D2", password: "beep-boop" };
let user: Users;
describe("Testing Model: user", () => {
	it("Must have a create method", () => {
		expect(userStore.create).toBeDefined();
	});

	it("Testing the create model with a user", async () => {
		user = await userStore.create(userBase);
		expect({ firstName: user.firstName, lastName: user.lastName }).toEqual({
			firstName: userBase.firstName,
			lastName: userBase.lastName,
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

	// it("Must have an update method", () => {
	// 	expect(userStore.update).toBeDefined();
	// });

	// it("Testing the update model to return the updated user", async () => {
	// 	const updatedUser = await userStore.update({ ...user, firstName: "C3", lastName: "PO" });
	// 	expect({ id: user.id, firstName: "C3", lastName: "PO", password: user.password }).toEqual({
	// 		id: updatedUser.id,
	// 		firstName: updatedUser.firstName,
	// 		lastName: updatedUser.lastName,
	// 		password: updatedUser.password,
	// 	});
	// });

	// it("Must have a delete method", () => {
	// 	expect(userStore.delete).toBeDefined();
	// });

// 	it("Testing the delete model to return the deleted user", async () => {
// 		const deletedUser = await userStore.delete(user.id as number);
// 		expect(deletedUser.id).toEqual(user.id);
// 	});
});