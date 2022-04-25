import { Product, ProductStore } from "../../models/products";

const productStore = new ProductStore();
const productBase: Product = { name: "Striker Eureka", price: 10000000, category: "Experimental Vehicles" };
let product: Product;

describe("Testing Model: product", () => {
	it("Must have a create method", () => {
		expect(productStore.create).toBeDefined();
	});

	it("Testing the create model with a product", async () => {
		product = await productStore.create(productBase);
		expect({ name: product.name, price: product.price, category: product.category }).toEqual({
			name: productBase.name,
			price: productBase.price,
			category: productBase.category,
		});
	});

	it("Must have an index method", () => {
		expect(productStore.index).toBeDefined();
	});

	it("Testing the index model to include the product", async () => {
		const products = await productStore.index();
		expect(products).toContain(product);
	});

	it("Must have a show method", () => {
		expect(productStore.show).toBeDefined();
	});

	it("Testing the show model to return the product", async () => {
		const foundProducts = await productStore.show(product.id as number);
		expect(foundProducts).toEqual(product);
	});

});