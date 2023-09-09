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
      if (response.redirected) {
        window.location.href = response.url;
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
