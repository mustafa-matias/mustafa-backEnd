const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = registerForm[0].value.toLowerCase();
  const lastName = registerForm[1].value.toLowerCase();
  const email = registerForm[2].value.toLowerCase();
  const age = registerForm[3].value;
  const password = registerForm[4].value;

  const newUsuario = {
    firstName,
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
    .then((result) => {
      if (result.status === 200) {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          title: "Registro Correcto",
          icon: "success",
        });
        setTimeout(function () {
          window.location.replace("/products");
        }, 1000);
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          title: "E-mail ya registrado",
          icon: "error",
          background: "#000",
        });
      }
    })
    .catch(function (err) {
      console.info(err + " url: " + url);
    });
});
