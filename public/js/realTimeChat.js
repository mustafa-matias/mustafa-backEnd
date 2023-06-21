const socket = io.connect();

const form = document.getElementById('form-chat');

let newMessage = {};
let user;
const usuarios = [];

Swal.fire({
    title: 'Nombre de Usuario',
    input: 'text',
    inputValidator: (value) => {
        return !value && 'Ingrese su nombre'
    },
    allowOutsideClick: false,
}).then((result) => {
    user = result.value;
    usuarios.push(user);
    socket.emit('autenticación', user);
    const bienvenida = document.getElementById("bienvenida");
    bienvenida.innerHTML = `<span>Empeza a chatear </span>
    <span class="text-uppercase text-success">${user}😀</span>
    `

})

const objetoEvento = (e) => {
    const message = e.target[0].value;
    if (!message) {
        return
    }
    newMessage = {
        user: user,
        message: message,
    }
}

form.addEventListener('submit', (e) => {
    objetoEvento(e);
    e.preventDefault();
    socket.emit('message', newMessage)
    form.reset();
})

const imprimir = (data) => {
    let today = new Date();
    let now = today.toLocaleString();

    const contenedorMensajes = document.getElementById("contenedorMensajes");
    const divMessage = document.createElement("div");
    divMessage.classList.add("bg-light", "d-flex", "justify-content-between", "mx-auto");
    const estructuraMensaje =
        `
        <div>
            <span class= "m-1 fw-bold text-uppercase">
                ${data.user}:
            </span>
            <span>
                ${data.message}
            </span>
        </div>
        <div class= "m-1 text-right">
            <span >
                [${now}hs]
            </span>
        </div>
        `
    divMessage.innerHTML = estructuraMensaje;
    contenedorMensajes.appendChild(divMessage);
}

socket.on('mostrarMesajes', (message) => {
    imprimir(message);
});

socket.on('newUserAlert', (data) => {
    if (!user) return
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        title: data + ' se ha unido al chat',
        icon: 'success'
    })

})

