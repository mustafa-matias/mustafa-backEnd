const socket = io.connect();

const form = document.getElementById('form-product');

let newProduct ={};
const objetoEvento = (e) =>{
    const titleProduct = e.target[0].value;
    const descriptionProduct = e.target[1].value;
    const priceProduct = e.target[2].value;
    const imageProduct = e.target[3].value;
    const codeProduct = e.target[4].value;
    const stockProduct = e.target[5].value;
    const categoryProduct = e.target[6].value;
    newProduct = {
        title: titleProduct,
        description: descriptionProduct,
        price: priceProduct,
        thumbnail: imageProduct,
        code: codeProduct,
        stock: stockProduct,
        category: categoryProduct
    }
}

form.addEventListener('submit', (e) => {
    objetoEvento(e);
    e.preventDefault();
    socket.emit('newProduct', newProduct)
    form.reset();
})

const imprimir = (product) =>{
    const contenedorProducts = document.getElementById("contenedorProducts");
    const divProduct = document.createElement("div");
    divProduct.classList.add("card", "shadow-sm", "border-dark", "rounded", "w-25","mx-auto","mb-2","mt-2");

    const estructuraProducto =
        `
        <img src=${product.thumbnail} alt=${product.title} srcset="">
        <div class="card-body bg-secondary-subtle text-center">
            <div class="d-flex justify-content-between">
                <p class="text-center fw-bold text-uppercase">${product.title}</p>
            </div>
            <p class="card-text">${product.description}</p>
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-body-secondary fw-bold">${product.price}}</small>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
`
    divProduct.innerHTML = estructuraProducto;
    contenedorProducts.appendChild(divProduct);
}

socket.on('imprimir', (product) => {
    imprimir(product);
});

socket.om('postNewProduct', (product) => {
    imprimir(product);
});