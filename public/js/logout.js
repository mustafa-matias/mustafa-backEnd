const LogoutButton = document.getElementById("LogoutButton");

LogoutButton.addEventListener("click", (e) => {

  fetch(`/api/sessions/logout`, {
    method: "GET",
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
      window.location.href = `http://localhost:8080/sessions/login`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
