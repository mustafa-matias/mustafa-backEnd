const buttonChat = document.getElementById("buttonChat");
if (buttonChat) {
  buttonChat.addEventListener("click", (e) => {
    fetch("/chat", {
      method: "GET",
    })
      .then((result) => {
        if (result.status === 200) {
          setTimeout(function () {
            window.location.replace("/chat");
          }, 1000);
        } else {
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
            title: "El Admin no puede acceder al Chat",
            icon: "error",
            background: "#000",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}
