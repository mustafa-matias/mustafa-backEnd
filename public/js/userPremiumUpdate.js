const premiumFormUpdate = document.getElementById("premiumFormUpdate");

if (premiumFormUpdate) {
  premiumFormUpdate.addEventListener("click", (e) => {
    e.preventDefault();
    const formAction = premiumFormUpdate.action;
    const segments = formAction.split("/");
    const id = segments[segments.length - 1];

    fetch(formAction, {
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
        window.location.href = `http://localhost:8080/users/premium/${id}`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}
