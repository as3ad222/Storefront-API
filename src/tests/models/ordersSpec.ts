import { Order, OrderStore } from "../../models/orders";
import {UserModel } from "../../models/users";

const orderStore = new OrderStore();
const userStore = new UserModel();
const orderBase: Order = { status: "active", user_id: "", items: [null] };
let order: Order;

describe("Testing Model: order", () => {
	beforeAll(async () => {
		const user = await userStore.create({ firstname: "Asaad", lastname: "Mohammed", password: "pass" });
		if (user.id) orderBase.user_id = user.id.toString();
	});
	it("Must have a create method", () => {
		expect(orderStore.create).toBeDefined();
	});

	it("Testing the create model with an order", async () => {
		order = await orderStore.create(orderBase);
		order.items = [null];
		expect({ status: order.status, user_id: order.user_id }).toEqual({
			status: orderBase.status,
			user_id: orderBase.user_id,
		});
	});

	it("Must have an index method", () => {
		expect(orderStore.index).toBeDefined();
	});

	it("Testing the index model to include the order", async () => {
		const orders = await orderStore.index();
		expect(orders).toContain(order);
	});

	it("Must have a show method", () => {
		expect(orderStore.show).toBeDefined();
	});

	it("Testing the show model to return the order", async () => {
		const foundOrder = await orderStore.show(order.id as number);
		expect(foundOrder).toEqual({ id: order.id, status: order.status, user_id: order.user_id });
	});

	it("Must have a delete method", () => {
		expect(orderStore.delete).toBeDefined();
	});

	it("Testing the delete model to return the deleted product", async () => {
		const deletedOrder = await orderStore.delete(order.id as number);
		expect(deletedOrder.id).toEqual(order.id);
	});
});