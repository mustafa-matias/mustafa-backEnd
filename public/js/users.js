document.addEventListener("DOMContentLoaded", function () {
  const elimanarInactivosButtom = document.getElementById("eliminarInactivos");

  if (elimanarInactivosButton) {
    elimanarInactivosButtom.addEventListener("click", function () {
      fetch(`/api/users`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            Swal.fire(
              "Se eliminaron solo los usuarios inactivos por 2 días",
              data.message,
              "success"
            );
          } else {
            Swal.fire("Error", "Error al eliminar el usuario", "error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }

  let deleteButtons = document.querySelectorAll(".btn-delete-user");
  if (deleteButtons) {
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
  }
  let updateButtons = document.querySelectorAll(".btn-update-user");
  if (updateButtons) {
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
  }

  const buttonGetUsers = document.getElementById("buttonGetUsers");
  if (buttonGetUsers) {
    buttonGetUsers.addEventListener("click", (e) => {
      fetch("/users/details", {
        method: "GET",
      })
        .then((result) => {
          if (result.status === 200) {
            setTimeout(function () {
              window.location.replace(
                "https://mustafa-backend-production.up.railway.app/users/details"
              );
            }, 1000);
          } else {
            Swal.fire({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 5000,
              title: "Para ingresar debes ser Admin",
              icon: "error",
              background: "#000",
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }
});
