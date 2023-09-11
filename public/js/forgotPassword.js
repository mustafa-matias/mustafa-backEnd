const forgotPassword = document.getElementById("forgotPassword");

forgotPassword.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = forgotPassword.email.value.toLowerCase();

  fetch("/api/sessions/forgotPassword", {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.redirected) {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          title: "Verifique su casilla de correo",
          icon: "success",
        });
        setTimeout(function () {
          window.location.href = response.url; //
        }, 1000);
      } else {
        Swal.fire({
          icon: "error",
          position: "top-end",
          title: "Usuario no registrado",
          background: "#000",
        });
      }
    })
    .catch(function (err) {
      console.info(err + " url: " + url);
    });
});