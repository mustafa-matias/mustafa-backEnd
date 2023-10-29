const purchaseButton = document.getElementById("purchaseButton");
const currentURL = window.location.href;
const segments = currentURL.split("/");
const cartId = segments[segments.length - 1];

const productsCount = document.querySelectorAll(".eliminarProductoButton").length;
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
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error al realizar la solicitud: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Respuesta exitosa:", data);
      window.location.href = `http://localhost:8080/purchase`;
    })
    .catch((error) => {
      console.error("Error:", error);
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

const eliminarProductoButtons = document.querySelectorAll(".eliminarProductoButton");

eliminarProductoButtons.forEach((button) => {
  const addToCartForm = button.closest("form");
  if (!addToCartForm) {
    console.error("No se pudo encontrar el formulario asociado al botón.");
    return;
  }

  button.addEventListener("click", (e) => {
    e.preventDefault()
    fetch(addToCartForm.action, {
      method: 'DELETE',
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
            title: "No puede el producto del carrito",
            background: "#000",
          });
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud fetch: " + error);
      });
  });
});
