const buttonCart = document.getElementById("buttonCart");
if (buttonCart) {
  const dataIdCart = buttonCart.getAttribute("data-cart");
  const url = "/carts/" + dataIdCart;

  buttonCart.addEventListener("click", (e) => {
    fetch(url, {
      method: "GET",
    })
      .then((result) => {
        if (result.status === 200) {
          setTimeout(function () {
            window.location.replace(url);
          }, 1000);
        } else {
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
            title: "El Admin no puede acceder al Carrito",
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
