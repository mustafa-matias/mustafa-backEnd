const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm[0].value.toLowerCase();
    const password = loginForm[1].value;

    let newLogin = { email, password }

    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(newLogin),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.replace('/products');
        }
    })
})