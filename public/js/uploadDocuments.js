console.log("JavaScript cargado");
const addDocumentForm = document.getElementById("addDocumentForm");
// const uploadButton = document.getElementById("uploadButton");
// const fotoPerfilInput = document.getElementById("fotoPerfil");
// const dniFrenteInput = document.getElementById("dniFrente");
// const dniDorsoInput = document.getElementById("dniDorso");
// const siguienteButton = document.getElementById("premiumButton");

// console.log(addDocumentForm)

addDocumentForm.addEventListener("submit", function (e) {
  try{
  e.preventDefault();
  console.log("js upload");
  const formData = new FormData(addDocumentForm);
  // console.log(addDocumentForm[0].files[0])
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
      console.log("Solicitud exitosa:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    })}catch(error){
      console.log(error)
    };
});

// function checkInputsFilled() {
//   if (
//     fotoPerfilInput.files.length > 0 &&
//     dniFrenteInput.files.length > 0 &&
//     dniDorsoInput.files.length > 0
//   ) {
//     uploadButton.disabled = false;
//   } else {
//     uploadButton.disabled = true;
//   }
//   console.log("Inputs revisados")
// }
// function showSiguienteButton() {
//   siguienteButton.style.display = "block";
//   uploadButton.disabled = true;
//   Swal.fire({
//     toast: true,
//     position: "top-end",
//     showConfirmButton: false,
//     timer: 5000,
//     title: "Los archivos se han cargado de forma exitosa",
//     icon: "success",
//   });
// }

// fotoPerfilInput.addEventListener("change", checkInputsFilled);
// dniFrenteInput.addEventListener("change", checkInputsFilled);
// dniDorsoInput.addEventListener("change", checkInputsFilled);
// uploadButton.addEventListener("click", showSiguienteButton);
// console.log("Event Listeners agregados");
// function fileSelected(input) {
//   input.disabled = true;
//   const fileDescription = input.nextElementSibling;
//   fileDescription.innerHTML = "Archivo cargado";
// }
