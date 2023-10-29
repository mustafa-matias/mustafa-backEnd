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
    .then((response) => {
      console.log(response);
      if (response.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          title: "Su contraseña ha sido reestablecida",
          icon: "success",
        });
        setTimeout(function () {
          window.location.href = `http://localhost:8080/sessions/login`;
        }, 1000);
      } else {
        Swal.fire({
          icon: "error",
          position: "top-end",
          title: "Las contraseñas no válidas",
          background: "#000",
        });
      }
    })
    .catch(function (err) {
      console.info(err + " url: " + url);
    });
});

function obtenerToken() {
  const url = new URL(window.location.href);
  return url.pathname.split("/").pop();
}
