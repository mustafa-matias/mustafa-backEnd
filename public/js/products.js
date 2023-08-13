document.addEventListener('DOMContentLoaded', () => {

    const btEliminarProductAdmins = document.querySelectorAll('.btEliminarProductAdmin');

    btEliminarProductAdmins.forEach(btEliminarProductAdmin => {

        btEliminarProductAdmin.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btEliminarProductAdmin.getAttribute('data-item-id');
            const confirmation = confirm('¿Estás seguro de que deseas eliminar?');
            if (confirmation) {
                const url = `http://localhost:8080/api/products/${id}`;
                fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                    .then(response => {
                        if (response.ok) {
                            console.log('Eliminado exitosamente');
                        } else {
                            console.error('Error al eliminar');
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud DELETE:', error);
                    });
            }
        })
    })
});
