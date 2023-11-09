const addDocumentForm = document.getElementById("addDocumentForm");

addDocumentForm.addEventListener("submit", function (e) {
  try {
    e.preventDefault();
    const formData = new FormData(addDocumentForm);
    const currentURL = window.location.href;

    const segments = currentURL.split("/");
    const userIndex = segments.indexOf("users");
    const uid = segments[userIndex + 1];

    fetch(`/api/users/${uid}/documents`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log("Solicitud rechazada:", data);
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
            title: data.error,
            icon: "error",
            background: "#000",
          });
        } else {
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
            title: "Se cargaron de forma exitosa los documentos",
            icon: "success",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error);
  }
});
