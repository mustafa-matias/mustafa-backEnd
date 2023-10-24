document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("upload-form");

  uploadForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(uploadForm);

    fetch(uploadForm.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Solicitud exitosa:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

function fileSelected(input) {
  input.disabled = true;
  const fileDescription = input.nextElementSibling;
  fileDescription.innerHTML = "Archivo cargado";
}

const fotoPerfilInput = document.getElementById("fotoPerfil");
const dniFrenteInput = document.getElementById("dniFrente");
const dniDorsoInput = document.getElementById("dniDorso");
const siguienteButton = document.getElementById("premiumButton");
const uploadButton = document.getElementById("uploadButton");

function checkInputsFilled() {
  if (fotoPerfilInput.files.length > 0 && dniFrenteInput.files.length > 0 && dniDorsoInput.files.length > 0) {
    uploadButton.disabled = false; 
  } else {
    uploadButton.disabled = true; 
  }
}

function showSiguienteButton() {
  siguienteButton.style.display = "block"; 
  uploadButton.disabled = true; 
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    title: "Los archivos se han cargado de forma exitosa",
    icon: "success",
  });
}

fotoPerfilInput.addEventListener("change", checkInputsFilled);
dniFrenteInput.addEventListener("change", checkInputsFilled);
dniDorsoInput.addEventListener("change", checkInputsFilled);
uploadButton.addEventListener("click", showSiguienteButton);


