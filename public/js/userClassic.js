document.addEventListener("DOMContentLoaded", function () {
  const premiumForm = document.getElementById("premiumForm");
  if (premiumForm) {
    premiumForm.addEventListener("click", (e) => {
      e.preventDefault();
      const uid =  premiumForm.data-id-user;
      console.log(uid)

      fetch(`/api/users/premium/${uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            Swal.fire({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 5000,
              title: "El Admin no puede dejar de ser Premium",
              icon: "error",
              background: "#000",
            });
            throw new Error(
              `Error al realizar la solicitud: ${response.status}`
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log("Respuesta exitosa:", data);
          window.location.href = actionUrl;
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }
});
