const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', e => {
    e.preventDefault();

    const firtName = registerForm[0].value.toLowerCase();
    const lastName = registerForm[1].value.toLowerCase();
    const email = registerForm[2].value.toLowerCase();
    const age = registerForm[3].value;
    const password = registerForm[4].value;
    let role = 'user';
    if (email == 'admincoder@coder.com') {
        role = 'admin';
    }

    const newUsuario = {
        firtName, lastName, email, age, password, role
    };
    registerForm.reset();

    fetch('/api/sessions/register', {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify(newUsuario),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
        .catch(function (err) {
            console.info(err + " url: " + url);
        });
}
)




