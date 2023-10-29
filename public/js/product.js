document.addEventListener("DOMContentLoaded", () => {
  const addToCartButton = document.getElementById("addToCartProduct");

    addToCartButton.addEventListener("click", function (e) {
      e.preventDefault();

      const addToCartForm = this.closest("form");
      if (!addToCartForm) {
        console.error("No se pudo encontrar el formulario asociado al botón.");
        return;
      }

      fetch(addToCartForm.action, {
        method: addToCartForm.method,
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 5000,
              title: "Se agregó el producto con éxito",
              icon: "success",
            });
          } else {
            Swal.fire({
              icon: "error",
              position: "top-end",
              title: "No puede agregar un producto de su propiedad al carrito",
              background: "#000",
            });
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud fetch: " + error);
        });
    });
});
