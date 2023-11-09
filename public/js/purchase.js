const purchaseButton = document.getElementById("purchaseButton");
const currentURL = window.location.href;
const segments = currentURL.split("/");
const cartId = segments[segments.length - 1];

const productsCount = document.querySelectorAll(
  ".eliminarProductoButton"
).length;
if (productsCount === 0) {
  purchaseButton.disabled = true;
}

purchaseButton.addEventListener("click", function () {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.error) {
        const productosProcesados = data.ProductosProcesados;
        const productosNoProcesados = data.ProductosNoProcesados;
        let message;
        if (!productosNoProcesados) {
          message = `Compra Exitosa`;
        } else {
          message = `Compra procesada con éxito. Productos procesados: ${productosProcesados.length}. Productos no procesados: ${productosNoProcesados.length}.`;
        }
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          title: message,
          icon: "success",
        });
        setTimeout(function () {
          window.location.href = "http://localhost:8080/purchase";
        }, 1000);
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          title: data.error,
          icon: "error",
          background: "#000",
        });
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud fetch: " + error);
    });
});

const eliminarTodoButton = document.getElementById("eliminarTodoButton");

eliminarTodoButton.addEventListener("click", function () {
  fetch(`/api/carts/${cartId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error al realizar la solicitud: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Respuesta exitosa:", data);
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        title: "Se vacio el carrito",
        icon: "success",
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

const eliminarProductoButtons = document.querySelectorAll(
  ".eliminarProductoButton"
);

eliminarProductoButtons.forEach((button) => {
  const addToCartForm = button.closest("form");
  if (!addToCartForm) {
    console.error("No se pudo encontrar el formulario asociado al botón.");
    return;
  }

  button.addEventListener("click", (e) => {
    e.preventDefault();
    fetch(addToCartForm.action, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
            title: "Se elimino el producto correctamente",
            icon: "success",
          });
        } else {
          Swal.fire({
            icon: "error",
            position: "top-end",
            title: "Error al eliminar el producto del carrito",
            background: "#000",
          });
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud fetch: " + error);
      });
  });
});
