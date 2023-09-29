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
