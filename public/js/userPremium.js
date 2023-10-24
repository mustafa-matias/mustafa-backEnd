const premiumButton = document.getElementById("premiumButton");

premiumButton.addEventListener("click", (e) => {
  e.preventDefault();

  const currentURL = window.location.href;
  
  const segments = currentURL.split("/");
  const userIndex = segments.indexOf("users");
  const uid = segments[userIndex + 1];

  fetch(`/api/users/premium/${uid}`, {
    method: "PUT",
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
      window.location.href = `http://localhost:8080/users/premium/${uid}`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
