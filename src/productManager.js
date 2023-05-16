import fs from "fs";

export default class ProductManager {
    constructor() {
        this.path = "./products.json";
    }

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(data);
            return products;
        } else {
            return [];
        }
    }

    addProduct = async (title, desctiption, price, thumbnail, code, stock) => {
        if (title == null || desctiption == null || price == null || thumbnail == null || code == null || stock == null) {
            console.log('Debe llenar todos los campos');
        }

        const products = await this.getProducts();

        const aux = await products.find((product) => product.code == code);

        if (aux) {
            console.log(`Ya existe el producto con el code: ${code}`);
            return;
        }

        const product = { title, desctiption, price, thumbnail, code, stock }

        if (products.length === 0) {
            product.id = 1
        } else {
            product.id = products[products.length - 1].id + 1;
        }

        products.push(product);

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return products;
    }

    getProductByid = async (id) => {
        const products = await this.getProducts();
        const product = await products.find((product) => product.id == id);
        if (!product) {
            console.log(`El id: ${id} no existe!`);
            return;
        } else {
            console.log(`El id: ${id} corresponde al producto:\n${product.title}!\nDescripción: ${product.desctiption}\nPrecio: ${product.price}\nimagen: ${product.thumbnail}\nStock: ${product.stock}\nCode: ${product.code}`);
        }
        return product;
    }

    deleteProductByid = async (id) => {
        const products = await this.getProducts();
        const product = products.find((product) => product.id == id);
        const indice = products.indexOf(product);
        products.splice(indice, 1);

        if (!product) {
            console.log(`El id: ${id} no existe!`);
            return;
        } else {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            console.log(`Su id: ${id} fue eliminado`);
        }
        return product;
    }

    updateProduct = async (id, update) => {
        const products = await this.getProducts();
        const product = await products.find((product) => product.id == id);

        if (!product) {
            console.log(`El Id: ${id} no existe!`);
            return;
        }
        const indice = products.findIndex((product) => product.id == id);
        products[indice] = { ...products[indice], ...update }
        console.log(`Se acualizo el producto: ${products[indice].title}.`)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
    }
}

const testProducts = new ProductManager;

const testFn = async () => {
    await testProducts.addProduct(
        "Coca Cola",
        "Gaseosa",
        3,
        "images/coca.pjg",
        100,
        450
    );
    await testProducts.addProduct(
        "Alfajor",
        "Triple",
        1,
        "images/alfajor.pjg",
        50,
        500
    );
    await testProducts.addProduct(
        "Galletas",
        "Saladas",
        5,
        "images/galletas.pjg",
        120,
        750
    );
    await testProducts.getProducts();
    await testProducts.getProductByid(1);
    await testProducts.updateProduct(3, { price: 100000 });
    await testProducts.deleteProductByid(2);
};

await testFn();




