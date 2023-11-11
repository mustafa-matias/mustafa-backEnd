document.addEventListener("DOMContentLoaded", function () {
  const forgotPasswordForm = document.getElementById("forgotPassword");

  forgotPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = forgotPasswordForm.querySelector('input[name="email"]').value;
    console.log(email)

    fetch("/api/sessions/forgotPassword", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Usuario no registrado");
        }
      })
      .then((data) => {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          title: "Verifique su casilla de correo",
          icon: "success",
        });
        setTimeout(() => {
          window.location.href =
          `https://mustafa-backend-production.up.railway.app/sessions/login`;
        }, 1000);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          position: "top-end",
          title: error.message,
          background: "#000",
        });
      });
  });
});
