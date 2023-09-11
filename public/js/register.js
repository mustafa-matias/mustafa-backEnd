const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const firtName = registerForm[0].value.toLowerCase();
  const lastName = registerForm[1].value.toLowerCase();
  const email = registerForm[2].value.toLowerCase();
  const age = registerForm[3].value;
  const password = registerForm[4].value;

  const newUsuario = {
    firtName,
    lastName,
    email,
    age,
    password,
  };
  registerForm.reset();

  fetch("/api/sessions/register", {
    method: "POST",
    redirect: "follow",
    body: JSON.stringify(newUsuario),
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
          title: "Registro correcto",
          icon: "success",
        });
        setTimeout(function () {
          window.location.href = response.url;
        }, 1000);
      } else {
        Swal.fire({
          icon: "error",
          position: "top-end",
          title: "Usuario ya existente",
          background: "#000",
        });
      }
    })
    .catch(function (err) {
      console.info(err + " url: " + url);
    });
});
