const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm[0].value.toLowerCase();
  const password = loginForm[1].value;

  let newLogin = { email, password };

  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(newLogin),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        title: "Acceso correcto",
        icon: "success",
      });
      setTimeout(function () {
        window.location.replace("/products");
      }, 1000);
    } else {
      Swal.fire({
        icon: "error",
        position: "top-end",
        title: "Usuario y/o contraseña incorrecta",
        background: "#000",
      });
    }
  });
});
