const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', e => {
    e.preventDefault();

    const firtName = registerForm[0].value;
    const lastName = registerForm[1].value;
    const email = registerForm[2].value;
    const age = registerForm[3].value;
    const password = registerForm[4].value;

    const newUsuario = {
        firtName, lastName, email, age, password
    };
    registerForm.reset();
    
    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(newUsuario),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(result => {
        if (result.status === 200) {
            console.log(result)
            // window.location.replace('/products');
        }
    }
    )
})