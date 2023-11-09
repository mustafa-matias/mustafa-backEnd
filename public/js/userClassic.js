document.addEventListener("DOMContentLoaded", function () {
  const premiumForm = document.getElementById("premiumForm");
  if (premiumForm) {
    premiumForm.addEventListener("click", (e) => {
      e.preventDefault();
      const actionUrl = premiumForm.getAttribute("action");
      const uid = actionUrl.split("/").pop();

      fetch(`/api/users/premium/${uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
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
