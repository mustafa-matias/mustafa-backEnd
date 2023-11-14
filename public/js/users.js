document.addEventListener("DOMContentLoaded", function () {
  const elimanarInactivosButtom = document.getElementById("eliminarInactivos");

  elimanarInactivosButtom.addEventListener("click", function () {
    fetch(`/api/users`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          Swal.fire("Se eliminaron solo los usuarios inactivos por 2 días", data.message, "success");
        } else {
          Swal.fire("Error", "Error al eliminar el usuario", "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  let deleteButtons = document.querySelectorAll(".btn-delete-user");

  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      let userId = button.getAttribute("data-user-id");
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminarlo",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`/api/users/${userId}`, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "success") {
                Swal.fire("Eliminado", data.message, "success");
              } else {
                Swal.fire("Error", "Error al eliminar el usuario", "error");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      });
    });
  });
  let updateButtons = document.querySelectorAll(".btn-update-user");

  updateButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      let userId = button.getAttribute("data-update-id");
      Swal.fire({
        title: "¿Estás seguro que queres cambiar de rol?",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`/api/users/role/${userId}`, {
            method: "PUT",
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "success") {
                Swal.fire("Rol cambiado", data.message, "success");
              } else {
                Swal.fire("Error", "Error al cambiar el rol", "error");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      });
    });
  });

});
