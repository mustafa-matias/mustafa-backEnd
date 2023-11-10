document.addEventListener("DOMContentLoaded", function () {
  const resetPassword = document.getElementById("resetPassword");
  const token = obtenerToken();

  resetPassword.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = resetPassword.password.value.toLowerCase();
    const confirmPassword = resetPassword.confirmPassword.value;

    fetch(`/api/sessions/resetPassword/${token}`, {
      method: "POST",
      body: JSON.stringify({ password, confirmPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          Swal.fire({
            icon: "error",
            position: "top-end",
            title: data.error,
            background: "#000",
          });
        } else {
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
            title: "Se cambio la contraseña",
            icon: "success",
          });
          setTimeout(() => {
            window.location.href = "https://mustafa-backend-production.up.railway.app/sessions/login";
          }, 1000);
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  });

  function obtenerToken() {
    const url = new URL(window.location.href);
    return url.pathname.split("/").pop();
  }
});
