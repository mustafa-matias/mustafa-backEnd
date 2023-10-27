const purchaseButton = document.getElementById('purchaseButton');
purchaseButton.addEventListener("click", function(){
    const currentURL = window.location.href;
    const segments = currentURL.split("/");
    const cartId = segments[segments.length - 1];
    console.log(cartId);

    fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error al realizar la solicitud: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Respuesta exitosa:", data);
          window.location.href = `http://localhost:8080/purchase`;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
    