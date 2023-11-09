const premiumButton = document.getElementById("premiumButton");
const fotoPerfilInput = document.getElementById("fotoPerfil");
const dniFrenteInput = document.getElementById("dniFrente");
const dniDorsoInput = document.getElementById("dniDorso");
const uploadButton = document.getElementById("uploadButton");

function checkFiles() {
  if (
    fotoPerfilInput.files.length > 0 &&
    dniFrenteInput.files.length > 0 &&
    dniDorsoInput.files.length > 0
  ) {
    uploadButton.removeAttribute("disabled");
  }
}
document.getElementById("fotoPerfil").addEventListener("change", checkFiles);
document.getElementById("dniFrente").addEventListener("change", checkFiles);
document.getElementById("dniDorso").addEventListener("change", checkFiles);

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
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        title: "Debe cargar los 3 documentos para continuar",
        icon: "error",
        background: "#000",
    });
    });
});
