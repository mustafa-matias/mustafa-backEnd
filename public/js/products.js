document.addEventListener("DOMContentLoaded", () => {
  const btEliminarProductAdmins = document.querySelectorAll(
    ".btEliminarProductAdmin"
  );

  const addToCartButtons = document.querySelectorAll(".addToCartButton");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
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
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 5000,
              title: "No puede agregar al carrito un producto que le pertenece",
              icon: "error",
              background: "#000",
            });
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud fetch: " + error);
        });
    });
  });

  btEliminarProductAdmins.forEach((btEliminarProductAdmin) => {
    btEliminarProductAdmin.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btEliminarProductAdmin.getAttribute("data-item-id");
      const confirmation = confirm("¿Estás seguro de que deseas eliminar?");
      if (confirmation) {
        const url = `https://mustafa-backend-production.up.railway.app/api/products/${id}`;
        fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 5000,
                title: "producto eliminado correctamente",
                icon: "success",
              });
            } else {
              Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 5000,
                title: "No puede eliminar un producto que no le pertenece",
                icon: "error",
                background: "#000",
              });
            }
          })
          .catch((error) => {
            console.error("Error en la solicitud DELETE:", error);
          });
      }
    });
  });
})