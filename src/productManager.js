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

    addProduct = async (title, description, price, thumbnail, code, stock, status, category) => {
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            console.log('Debe llenar todos los campos');
            return
        }

        const products = await this.getProducts();

        const aux = await products.find((product) => product.code == code);

        if (aux) {
            console.log(`Ya existe el producto con el code: ${code}`);
            return;
        }

        const product = { title, description, price, thumbnail, code, stock, status, category }

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
            console.log(`El id: ${id} corresponde al producto:\n${product.title}!\nDescripción: ${product.description}\nPrecio: ${product.price}\nimagen: ${product.thumbnail}\nStock: ${product.stock}\nCode: ${product.code}`);
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
        if (update.id) {
            console.log(`No se puede actualizar la categoria ID`);
            return;
        }
        if (update.title || update.description || update.price || update.thumbnail || update.code || update.stock || update.status || update.category) {
            const indice = products.findIndex((product) => product.id == id);
            products[indice] = { ...products[indice], ...update }
            console.log(`Se acualizo el producto: ${products[indice].title}.`)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return
        } else {
            console.log(`Campo inexiste para ser actualizado`);
        }
    }
}

